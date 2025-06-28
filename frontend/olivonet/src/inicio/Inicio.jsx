import React, { useEffect, useState } from "react";
import "./Inicio.css";
import TarjetaCosecha from "../cosechas/TarjetaCosecha";
import DatosCalculadosCosechas from "../cooperativaAgr/DatosCalculadosCosechas";
import PanelTiempo from "../propiedades/tiempo/PanelTiempo";
import PreciosAceite from "../aceite/PreciosAceite";
import Espacio from "../extra/Espacio";

const Inicio = () => {
  const [nombre, setNombre] = useState("");
  const [cosechas, setCosechas] = useState([]);
  const [propiedades, setPropiedades] = useState([]);
  const [propiedadParaTiempo, setPropiedadParaTiempo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const usuario = "agricultor";

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const token = localStorage.getItem("token");

        const resPerfil = await fetch("http://localhost:5000/mi-perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataPerfil = await resPerfil.json();
        setNombre(dataPerfil.nombre || "Agricultor");

        const resPropiedades = await fetch(
          "http://localhost:5000/mis-propiedades",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const dataPropiedades = await resPropiedades.json();
        setPropiedades(dataPropiedades);

        const propiedadesConUbicacion = dataPropiedades.filter(
          (p) => p.coordenadas || p.direccion
        );

        if (propiedadesConUbicacion.length > 0) {
          const aleatoria =
            propiedadesConUbicacion[
              Math.floor(Math.random() * propiedadesConUbicacion.length)
            ];
          setPropiedadParaTiempo(aleatoria);
        }

        const temporada = 2025;
        const resCosechas = await fetch(
          `http://localhost:5000/mis-cosechas?temporada=${temporada}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const dataCosechas = await resCosechas.json();

        const cosechasConNombre = dataCosechas.map((cosecha) => {
          const propiedad = dataPropiedades.find(
            (p) => p.id === cosecha.idPropiedad
          );
          return {
            ...cosecha,
            nombrePropiedad: propiedad
              ? propiedad.nombre
              : "Propiedad desconocida",
          };
        });

        cosechasConNombre.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setCosechas(cosechasConNombre);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setNombre("Agricultor");
        setCosechas([]);
      } finally {
        setCargando(false);
      }
    };

    fetchDatos();
  }, []);

  if (cargando) return <p>Cargando perfil y cosechas...</p>;

  return (
    <div className="inicio-container">
      <h2>¡Bienvenid@, {nombre}!</h2>
      <p>Este es tu panel principal.</p>

      <div className="grid-columnas">
        <div className="columna-inicio">
          <div className="cuadro-inicio">
            <h2 className="titulos-inicio">
              Últimas cosechas de esta temporada
            </h2>
            <Espacio altura="0.4rem" />
            <div className="cosechas-lista">
              {cosechas.length === 0 ? (
                <p>No hay cosechas recientes.</p>
              ) : (
                cosechas.map((cosecha) => (
                  <TarjetaCosecha
                    key={cosecha.id}
                    cosecha={cosecha}
                    usuario={usuario}
                  />
                ))
              )}
            </div>
          </div>
          <div className="cuadro-inicio">
            <h2 className="titulos-inicio">Precios aceite de oliva</h2>
            <PreciosAceite />
          </div>
        </div>

        <div className="columna-inicio">
          <div className="cuadro-incio">
            <div className="olivos-resumen-lista">
              <DatosCalculadosCosechas modo="cuadricula" />
            </div>
          </div>

          <div className="cuadro-tiempo-inicio">
            <div className="cont-tiempo-inicio">
              <h2 className="titulos-inicio">
                Tiempo en{" "}
                {propiedadParaTiempo?.nombre || "ubicación desconocida"}
              </h2>
              <Espacio altura="1rem" />
              <PanelTiempo
                direccion={propiedadParaTiempo?.direccion}
                coordenadas={propiedadParaTiempo?.coordenadas}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
