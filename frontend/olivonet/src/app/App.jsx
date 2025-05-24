// App.jsx
import React, { useState } from "react";
import MenuLateral from "../menu/MenuLateral.jsx";
import Perfil from "../perfil/Perfil.jsx";
import Inicio from "../inicio/Inicio.jsx";
import "./App.css";

const App = () => {
  const [seccionActiva, setSeccionActiva] = useState("inicio");
  const [menuAbierto, setMenuAbierto] = useState(true); // ⬅Estado del menú

  const renderContenido = () => {
    switch (seccionActiva) {
      case "perfil":
        return <Perfil />;
      case "inicio":
        return <Inicio />;
      // puedes añadir más casos: propiedades, cooperativa, configuración...
      default:
        return <div>Selecciona una opción del menú</div>;
    }
  };

  return (
    <div className="contenedor-app">
      <MenuLateral
        setSeccionActiva={setSeccionActiva}
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
