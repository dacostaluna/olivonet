import React, { useEffect, useState } from "react";
import axios from "axios";
import ModalCrearPropiedad from "./ModalCrearPropiedad";
import Mensaje from "../extra/Mensaje";
import "./Propiedades.css";
import CuadroPropiedad from "./CuadroPropiedad";

const Propiedades = ({ seleccionarPropiedad }) => {
  const [propiedades, setPropiedades] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevaPropiedad, setNuevaPropiedad] = useState({
    nombre: "",
    descripcion: "",
    tipo: "",
    superficie: "",
    coordenadas: "",
    direccion: "",
  });
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

  const handleInputChange = (campo) => (e) => {
    setNuevaPropiedad((prev) => ({
      ...prev,
      [campo]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos los campos obligatorios
    const campos = Object.entries(nuevaPropiedad);
    for (const [clave, valor] of campos) {
      if (!valor || valor.toString().trim() === "") {
        setMensaje({
          texto: `El campo ${clave} es obligatorio`,
          tipo: "error",
        });
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/crear-propiedad",
        { ...nuevaPropiedad },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensaje({ texto: "Propiedad creada con éxito", tipo: "exito" });
      setNuevaPropiedad({
        nombre: "",
        descripcion: "",
        tipo: "",
        superficie: "",
        coordenadas: "",
        direccion: "",
      });
      setMostrarFormulario(false);
      fetchPropiedades();
    } catch (error) {
      console.error("Error al crear propiedad:", error);
      setMensaje({
        texto: error.response?.data?.message || "Error al crear la propiedad.",
        tipo: "error",
      });
    }
  };

  const cerrarModal = () => {
    setMostrarFormulario(false);
    setMensaje(null);
  };

  return (
    <div className="contenedor-propiedades">
      <div className="barra-superior">
        <h1>Mis propiedades</h1>
        <button className="boton-añadir" onClick={handleAñadir}>
          Añadir propiedad <span className="circulo-mas">+</span>
        </button>
      </div>

      {mostrarFormulario && (
        <ModalCrearPropiedad
          nuevaPropiedad={nuevaPropiedad}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          mensaje={mensaje}
          onCerrar={cerrarModal}
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
    </div>
  );
};

export default Propiedades;
