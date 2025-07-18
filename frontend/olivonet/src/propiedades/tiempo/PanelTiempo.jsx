import React from "react";
import Tiempo from "./Tiempo";
import TiempoActual from "./TiempoActual";
import "./PanelTiempo.css";
import Espacio from "../../extra/Espacio";

const PanelTiempo = ({ direccion, coordenadas}) => {
  return (
    <div className="panel-tiempo">
      <TiempoActual
        className="tiempo-actual"
        direccion={direccion}
        coordenadas={coordenadas}
        ruta="actual"
        dia="Hoy"
      />
      <Espacio/>

      <div className="tiempo-dias">
        <Tiempo direccion={direccion} coordenadas={coordenadas} ruta="pronostico/1"  />
        <Tiempo direccion={direccion} coordenadas={coordenadas} ruta="pronostico/2"  />
        <Tiempo direccion={direccion} coordenadas={coordenadas} ruta="pronostico/3"  />
        <Tiempo direccion={direccion} coordenadas={coordenadas} ruta="pronostico/4"  />
      </div>
      
    </div>
  );
};

export default PanelTiempo;
