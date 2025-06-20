import { useEffect, useState } from "react";
import TarjetaCosecha from "./TarjetaCosecha";
import "./CuadroCosechas.css";

const CuadroCosechas = ({ urlBase, urlPropiedades, usuario }) => {
  const [cosechas, setCosechas] = useState([]);
  const [temporadas, setTemporadas] = useState([]);
  const [temporadaSeleccionada, setTemporadaSeleccionada] = useState("Todas");

  const fetchPropiedades = async (token) => {
    const resPropiedades = await fetch(urlPropiedades, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!resPropiedades.ok) throw new Error("Error al obtener propiedades");
    return await resPropiedades.json();
  };

  const fetchCosechasPorTemporada = async (temporada, token) => {
    const urlTemporada = `${urlBase}${
      urlBase.includes("?") ? "&" : "?"
    }temporada=${temporada}`;
    const res = await fetch(urlTemporada, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      // No pasa nada si no hay datos para esa temporada, devolvemos []
      return [];
    }
    return await res.json();
  };

  const fetchTodasCosechas = async () => {
    try {
      const token = localStorage.getItem("token");
      const propiedades = await fetchPropiedades(token);

      const mapaPropiedades = {};
      for (const prop of propiedades) {
        mapaPropiedades[prop.id] = prop.nombre;
      }

      const currentYear = new Date().getFullYear();
      const cosechasTotales = [];

      // Hacemos peticiones paralelas (puede ser lento si hay muchas temporadas, ajustar si quieres)
      const promesas = [];
      for (let año = 2000; año <= currentYear; año++) {
        promesas.push(fetchCosechasPorTemporada(año, token));
      }
      const resultados = await Promise.all(promesas);

      // Aplanar resultados y asignar nombrePropiedad
      for (const listaCosechas of resultados) {
        for (const c of listaCosechas) {
          cosechasTotales.push({
            ...c,
            nombrePropiedad: mapaPropiedades[c.idPropiedad] || "Desconocida",
          });
        }
      }

      setCosechas(cosechasTotales);

      // Extraer temporadas únicas
      const temporadasUnicas = [
        ...new Set(
          cosechasTotales
            .map((c) => String(c.temporada).trim())
            .filter((t) => t !== "")
        ),
      ].sort((a, b) => b - a); // ordenar descendente para ver las últimas primero

      setTemporadas(temporadasUnicas);
    } catch (err) {
      console.error("Error al obtener cosechas:", err);
      setCosechas([]);
      setTemporadas([]);
    }
  };

  useEffect(() => {
    fetchTodasCosechas();
  }, [urlBase, urlPropiedades]);

  // Filtrar cosechas según temporadaSeleccionada
  const cosechasFiltradas =
    temporadaSeleccionada === "Todas"
      ? cosechas
      : cosechas.filter(
          (c) =>
            String(c.temporada).trim() === String(temporadaSeleccionada).trim()
        );

  return (
    <div>
      < div className="contenedor-principal-cosechas">
        <div className="filtro-temporada">
          <label>Filtrar por temporada: </label>
          <select
            value={temporadaSeleccionada}
            onChange={(e) => setTemporadaSeleccionada(e.target.value)}
          >
            <option value="Todas">Todas</option>
            {temporadas.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="cosechas-container">
          {cosechasFiltradas.length === 0 ? (
            <p className="mensaje-vacio">No hay cosechas para mostrar.</p>
          ) : (
            <div className="grid-cosechas">
              {cosechasFiltradas.map((cosecha) => (
                <TarjetaCosecha
                  key={cosecha.id}
                  cosecha={cosecha}
                  usuario={usuario}
                  actualizarCosechas={fetchTodasCosechas}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CuadroCosechas;
