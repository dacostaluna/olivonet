// App.jsx
import React, { useState } from "react";
import MenuLateral from "../menu/MenuLateral.jsx";
import Perfil from "../perfil/Perfil.jsx";
import Inicio from "../inicio/Inicio.jsx";
import Propiedades from "../propiedades/Propiedades.jsx";
import Propiedad from "../propiedades/Propiedad.jsx";
import "./App.css";

const App = () => {
  const [seccionActiva, setSeccionActiva] = useState("inicio");
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [idPropiedadSeleccionada, setIdPropiedadSeleccionada] = useState(null);

  const seleccionarPropiedad = (id) => {
    setIdPropiedadSeleccionada(id);
    setSeccionActiva("detalle-propiedad");
  };

  const volverAPropiedades = () => {
    setIdPropiedadSeleccionada(null);
    setSeccionActiva("propiedades");
  };

  const renderContenido = () => {
    switch (seccionActiva) {
      case "inicio":
        return <Inicio />;
      case "perfil":
        return <Perfil />;
      case "propiedades":
        return <Propiedades seleccionarPropiedad={seleccionarPropiedad} />;
      case "detalle-propiedad":
        return (
          <Propiedad
            idPropiedad={idPropiedadSeleccionada}
            volver={volverAPropiedades}
          />
        );
      default:
        return <div>Selecciona una opción del menú</div>;
    }
  };

  return (
    <div className="contenedor-app">
      <MenuLateral
        setSeccionActiva={(seccion) => {
          setSeccionActiva(seccion);
          setIdPropiedadSeleccionada(null); // Limpiar selección si se cambia de sección
        }}
        setMenuAbierto={setMenuAbierto}
      />
      <div
        className={`contenido-principal ${
          menuAbierto ? "contenido-con-menu" : "contenido-sin-menu"
        }`}
      >
        {renderContenido()}
      </div>
    </div>
  );
};

export default App;