import React from "react";
import "./CuadroPropiedad.css";

const CuadroPropiedad = ({ propiedad, onClick }) => {
  const { nombre, numOlivos, descripcion, color } = propiedad;

  return (
    <div
      className="cuadro-propiedad"
      onClick={onClick}
      style={{ "--color-propiedad": color || "#6a994e" }}
    >
      <div className="cuadro-arriba">
        <h2>{nombre}</h2>
      </div>
      <div className="cuadro-abajo">
        <p>
          <strong>Olivos: {numOlivos} </strong>
        </p>
        <p>{descripcion}</p>
      </div>
    </div>
  );
};

export default CuadroPropiedad;
