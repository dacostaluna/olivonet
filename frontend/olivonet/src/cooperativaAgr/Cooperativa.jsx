// Cooperativa.jsx
import React from "react";
import EncabezadoCooperativa from "../inicio/cooperativa/EncabezadoCooperativa";
import CuadroCosechas from "../cosechas/CuadroCosechas.jsx";
import CuadroMostrarDatos from "./CuadroMostrarDatos.jsx";
import DatosCalculadosCosechas from "./DatosCalculadosCosechas.jsx";

import "./Cooperativa.css";

const Cooperativa = () => {
  return (
    <div>
      <EncabezadoCooperativa
        tipoUsuario="agricultor"
        style={{ width: "100%" }}
      />
      <div className="cuadro-cooperativa-calculados-container">
      <DatosCalculadosCosechas modo="fila" />
      </div>
      <CuadroCosechas
        urlBase={`http://localhost:5000/mis-cosechas`}
        usuario="agricultor"
        tipoUsuario="agricultor"
      />
    </div>
  );
};

export default Cooperativa;
