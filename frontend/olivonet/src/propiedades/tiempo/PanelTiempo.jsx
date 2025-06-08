import React from "react";
import Tiempo from "./Tiempo";
import TiempoActual from "./TiempoActual";
import "./PanelTiempo.css";
import Espacio from "../../extra/Espacio";

const PanelTiempo = ({ direccion }) => {
  return (
    <div className="panel-tiempo">
      <TiempoActual
        className="tiempo-actual"
        direccion={direccion}
        ruta="/actual"
        dia="Hoy"
      />
      <Espacio/>

      <div className="tiempo-dias">
        <Tiempo direccion={direccion} ruta="/dia/1"  />
        <Tiempo direccion={direccion} ruta="/dia/2"  />
        <Tiempo direccion={direccion} ruta="/dia/3"  />
        <Tiempo direccion={direccion} ruta="/dia/4"  />
      </div>
      
    </div>
  );
};

export default PanelTiempo;
