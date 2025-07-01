import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import MenuLateral from "../menu/MenuLateral.jsx";
import Perfil from "../perfil/Perfil.jsx";
import Inicio from "../inicio/Inicio.jsx";
import Propiedades from "../propiedades/Propiedades.jsx";
import Propiedad from "../propiedades/Propiedad.jsx";
import Cooperativa from "../cooperativaAgr/Cooperativa.jsx";
import "./App.css";
import ChatBotIA from "../ia/ChatBotIA.jsx";

const AppLayout = () => {
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [idPropiedadSeleccionada, setIdPropiedadSeleccionada] = useState(null);
  const navigate = useNavigate();

  const seleccionarPropiedad = (id) => {
    setIdPropiedadSeleccionada(id);
    navigate("/propiedad");
  };

  const volverAPropiedades = () => {
    setIdPropiedadSeleccionada(null);
    navigate("/propiedades");
  };

  return (
    <div className="contenedor-app">
      <MenuLateral
        setSeccionActiva={(seccion) => {
          setIdPropiedadSeleccionada(null);
          navigate("/" + seccion);
        }}
        setMenuAbierto={setMenuAbierto}
      />
      <div
        className={`contenido-principal ${
          menuAbierto ? "contenido-con-menu" : "contenido-sin-menu"
        }`}
      >
        <Routes>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/cooperativa" element={<Cooperativa />} />
          <Route path="/chat" element={<ChatBotIA menuAbierto={menuAbierto} />} />
          <Route
            path="/propiedades"
            element={
              <Propiedades seleccionarPropiedad={seleccionarPropiedad} />
            }
          />
          <Route
            path="/propiedad"
            element={
              <Propiedad
                idPropiedad={idPropiedadSeleccionada}
                volver={volverAPropiedades}
              />
            }
          />
          <Route path="*" element={<div>Ruta no encontrada</div>} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return <AppLayout />;
};

export default App;
