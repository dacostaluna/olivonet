import React from "react";
import "./CuadroPropiedad.css";

const CuadroPropiedad = ({ propiedad, onClick }) => {
  return (
    <div className="cuadro-propiedad" onClick={onClick}>
      <img
        src="/img/propiedad-placeholder.jpg"
        alt={propiedad.nombre}
        className="cuadro-propiedad-img"
      />
      <h2 className="cuadro-propiedad-nombre">{propiedad.nombre}</h2>
      <p className="cuadro-propiedad-tipo">{propiedad.tipo}</p>
    </div>
  );
};

export default CuadroPropiedad;
