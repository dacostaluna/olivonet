// src/propiedades/Propiedad.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
//import "./Propiedad.css";

const Propiedad = ({ idPropiedad, volver }) => {
  const [propiedad, setPropiedad] = useState(null);

  useEffect(() => {
    const fetchPropiedad = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/propiedad/${idPropiedad}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPropiedad(response.data);
      } catch (error) {
        console.error("Error al obtener la propiedad:", error);
      }
    };

    fetchPropiedad();
  }, [idPropiedad]);

  if (!propiedad) return <p>Cargando propiedad...</p>;

  return (
    <div className="detalle-propiedad">
      <button onClick={volver} className="btn-volver">← Volver</button>
      <h1>{propiedad.nombre}</h1>
      <img src="/img/propiedad-placeholder.jpg" alt="Foto" className="detalle-img" />
      <p><strong>Tipo:</strong> {propiedad.tipo}</p>
      <p><strong>Superficie:</strong> {propiedad.superficie} m²</p>
      <p><strong>Coordenadas:</strong> {propiedad.coordenadas}</p>
      <p><strong>Dirección:</strong> {propiedad.direccion}</p>
      <p><strong>Descripción:</strong> {propiedad.descripcion}</p>
    </div>
  );
};

export default Propiedad;
