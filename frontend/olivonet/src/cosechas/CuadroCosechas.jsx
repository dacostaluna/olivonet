import { useEffect, useState } from "react";
import TarjetaCosecha from "./TarjetaCosecha";
import Formulario from "../extra/Formulario";

import "./CuadroCosechas.css";

const CuadroCosechas = ({ urlBase, urlPropiedades, usuario, refresh }) => {
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

      const promesas = [];
      for (let año = 2000; año <= currentYear; año++) {
        promesas.push(fetchCosechasPorTemporada(año, token));
      }
      const resultados = await Promise.all(promesas);

      for (const listaCosechas of resultados) {
        for (const c of listaCosechas) {
          cosechasTotales.push({
            ...c,
            nombrePropiedad: mapaPropiedades[c.idPropiedad] || "Desconocida",
          });
        }
      }

      setCosechas(cosechasTotales);

      const temporadasUnicas = [
        ...new Set(
          cosechasTotales
            .map((c) => String(c.temporada).trim())
            .filter((t) => t !== "")
        ),
      ].sort((a, b) => b - a);

      setTemporadas(temporadasUnicas);
    } catch (err) {
      console.error("Error al obtener cosechas:", err);
      setCosechas([]);
      setTemporadas([]);
    }
  };

  useEffect(() => {
    fetchTodasCosechas();
  }, [urlBase, urlPropiedades, refresh]);

  const cosechasFiltradas =
    temporadaSeleccionada === "Todas"
      ? cosechas
      : cosechas.filter(
          (c) =>
            String(c.temporada).trim() === String(temporadaSeleccionada).trim()
        );

  return (
    <div>
      <div className="filtro-temporada">
        <div className="filtro-temporada">
          <Formulario
            texto="Filtrar por temporada"
            type="select"
            value={temporadaSeleccionada}
            onChange={(e) => setTemporadaSeleccionada(e.target.value)}
            opciones={["Todas", ...temporadas]}
            width="15rem"
            mensajeInicial="Selecciona una temporada"
          />
        </div>
      </div>

      <div className="cosechas-container">
        {cosechasFiltradas.length === 0 ? (
          <p className="mensaje-vacio">No hay cosechas para mostrar.</p>
        ) : (
          <div className="grid-cosechas">
            {[...cosechasFiltradas]
              .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
              .map((cosecha) => (
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
  );
};

export default CuadroCosechas;
