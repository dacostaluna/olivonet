import React, { useEffect, useState } from "react";
import "./InfoAgricultorCosechas.css";
import defaultPerfil from "../assets/default_perfil.jpg";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date)) return "-";
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const InfoAgricultorCosechas = ({ agricultor }) => {
  const [numOlivos, setNumOlivos] = useState(null);
  const [numOlivosRecogidos, setNumOlivosRecogidos] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchPropiedades = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/cooperativa/obtenerPropiedades/${agricultor.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Error al obtener propiedades");
        const data = await response.json();
        if (Array.isArray(data)) {
          const totalOlivos = data.reduce(
            (acc, prop) => acc + (prop.numOlivos || 0),
            0
          );
          setNumOlivos(totalOlivos);
        } else {
          setNumOlivos(0);
        }
      } catch (error) {
        console.error(error);
        setNumOlivos(0);
      }
    };

    const fetchCosechas = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/cooperativa/obtenerCosechas/${agricultor.id}?temporada=2025`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Error al obtener cosechas");
        const data = await response.json();
        if (Array.isArray(data)) {
          const totalOlivosRecogidos = data.reduce(
            (acc, cosecha) => acc + (cosecha.numOlivos || 0),
            0
          );
          setNumOlivosRecogidos(totalOlivosRecogidos);
        } else {
          setNumOlivosRecogidos(0);
        }
      } catch (error) {
        console.error(error);
        setNumOlivosRecogidos(0);
      }
    };

    if (agricultor?.id) {
      fetchPropiedades();
      fetchCosechas();
    }
  }, [agricultor]);

  return (
    <div className="info-agricultor-cosechas">
      <div className="foto-container-cosechas">
        <img
          src={agricultor.fotoPerfil || defaultPerfil}
          alt={`${agricultor.nombre} ${agricultor.apellidos}`}
          className="foto-perfil foto-perfil-cosechas"
        />
      </div>

      <div className="contenido-cosechas">
        <h2 className="nombre-apellidos-cosechas">
          {agricultor.nombre} {agricultor.apellidos}
        </h2>

        <div className="datos-numeros-container">
          <div className="datos-container-cosechas">
            <div className="columna-cosechas">
              <p>
                <strong>DNI:</strong> {agricultor.dni || "-"}
              </p>
              <p>
                <strong>Correo:</strong> {agricultor.correo || "-"}
              </p>
            </div>
            <div className="columna-cosechas">
              <p>
                <strong>Usuario:</strong> {agricultor.username || "-"}
              </p>
              <p>
                <strong>Fecha de nacimiento:</strong>{" "}
                {formatDate(agricultor.fechaNacimiento)}
              </p>
            </div>
          </div>

          <div className="numeros-cosechas-propiedades">
            <p>
              {numOlivos === null ? (
                "Cargando olivos..."
              ) : (
                <>
                  <span className="numero-cosechas">{numOlivos}</span>{" "}
                  <span className="texto-cosechas">Olivos en propiedad</span>
                </>
              )}
            </p>
            <p>
              {numOlivosRecogidos === null ? (
                "Cargando olivos recogidos..."
              ) : (
                <>
                  <span className="numero-cosechas">{numOlivosRecogidos}</span>{" "}
                  <span className="texto-cosechas">
                    Olivos cosechados este año
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoAgricultorCosechas;
