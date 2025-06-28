import React, { useEffect, useState } from "react";
import axios from "axios";
import ModalCrearPropiedad from "./ModalCrearPropiedad";
import Mensaje from "../extra/Mensaje";
import "./Propiedades.css";
import CuadroPropiedad from "./CuadroPropiedad";
import Espacio from "../extra/Espacio";

const Propiedades = ({ seleccionarPropiedad }) => {
  const [propiedades, setPropiedades] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    fetchPropiedades();
  }, []);

  const fetchPropiedades = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        "http://localhost:5000/mis-propiedades",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (Array.isArray(data)) {
        setPropiedades(data);
      } else {
        setPropiedades([]);
        console.warn("Respuesta inesperada:", data);
      }
    } catch (error) {
      console.error("Error al obtener propiedades:", error);
      setMensaje({ texto: "Error al cargar las propiedades.", tipo: "error" });
    }
  };

  const handleAñadir = () => {
    setMostrarFormulario(true);
    setMensaje(null);
  };

  const cerrarModal = () => {
    setMostrarFormulario(false);
    setMensaje(null);
  };

  const onCrearExito = () => {
    fetchPropiedades();
  };

  return (
    <div className="contenedor-propiedades">
      <div className="barra-superior">
        <h1>Mis propiedades</h1>
        <Espacio/>
        <div>Desde este menú puedes <strong>gestionar tus olivares, fincas y propiedades</strong> en general. </div>
        <div>Añade la información relevante, organiza tus cultivos y consulta la información meteorológica.</div>
      </div>
      <button className="boton-flotante" onClick={handleAñadir}>
        Añadir Propiedad
        <div className="circulo-mas">+</div>
      </button>

      {mostrarFormulario && (
        <ModalCrearPropiedad
          onCerrar={cerrarModal}
          onCrearExito={onCrearExito}
        />
      )}

      <div className="propiedades-grid">
        {propiedades.length === 0 ? (
          <p className="mensaje-vacio">No tienes propiedades registradas.</p>
        ) : (
          propiedades.map((prop) => (
            <CuadroPropiedad
              key={prop.id}
              propiedad={prop}
              onClick={() => seleccionarPropiedad(prop.id)}
            />
          ))
        )}
      </div>
      {mensaje && <Mensaje tipo={mensaje.tipo} texto={mensaje.texto} />}
    </div>
  );
};

export default Propiedades;
