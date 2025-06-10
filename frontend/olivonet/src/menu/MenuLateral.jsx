import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonMenu from "./BotonMenu";
import "./MenuLateral.css";

import logo from "../assets/olivonet-icon.png";
import flecha from "../assets/flecha-izquierda.png";
import cerrar_sesion from "../assets/cerrar-sesion.png";
import Login from "../login/Login";

const MenuLateral = ({ setSeccionActiva, setMenuAbierto }) => {
  const navigate = useNavigate();
  const [activo, setActivo] = useState("inicio");
  const [abierto, setAbiertoLocal] = useState(true);

  const manejarClick = (seccion) => {
    setActivo(seccion);
    setSeccionActiva(seccion);
  };

  const alternarMenu = () => {
    const nuevoEstado = !abierto;
    setAbiertoLocal(nuevoEstado);
    setMenuAbierto(nuevoEstado); // Avisamos al componente padre
  };

  return (
    <>
      <button
        className={`boton-toggle-flotante ${abierto ? "abierto" : "cerrado"}`}
        onClick={alternarMenu}
      >
        ☰
      </button>
      {/* Menu lateral */}
      <aside className={`menu-lateral ${abierto ? "abierto" : "cerrado"}`}>
        {/* Cabecera con logo, separador vertical y botón toggle */}
        <div className="cabecera-menu-lateral">
          <img src={logo} alt="Logo" className="logo-menu" />
          <div className="barra-vertical" />
        </div>

        {/* Separador horizontal debajo de cabecera */}
        <hr className="separador-horizontal" />

        {/* Botones de navegación */}
        <div className="contenedor-botones">
          <BotonMenu
            texto="Inicio"
            icono="https://cdn-icons-png.flaticon.com/512/25/25694.png" // Casa, blanco y negro
            activo={activo === "inicio"}
            onClick={() => manejarClick("inicio")}
          />
          <BotonMenu
            texto="Propiedades"
            icono="https://cdn-icons-png.flaticon.com/512/747/747376.png" // Edificio/casa
            activo={activo === "propiedades"}
            onClick={() => manejarClick("propiedades")}
          />
          <BotonMenu
            texto="Cooperativa"
            icono="https://cdn-icons-png.flaticon.com/512/747/747310.png" // Grupo/personas
            activo={activo === "cooperativa"}
            onClick={() => manejarClick("cooperativa")}
          />
          <BotonMenu
            texto="Configuración"
            icono="https://cdn-icons-png.flaticon.com/512/126/126472.png" // Engranaje
            activo={activo === "configuracion"}
            onClick={() => manejarClick("configuracion")}
          />
          <BotonMenu
            texto="Perfil"
            icono="https://cdn-icons-png.flaticon.com/512/747/747376.png" // Usuario
            activo={activo === "perfil"}
            onClick={() => manejarClick("perfil")}
          />
        </div>
        <div className="menu-abajo">
          <button className="boton-simple cuadrado ayuda" title="Ayuda">
            ❓
          </button>
          <button
            className="boton-simple cuadrado cerrar-sesion"
            title="Cerrar sesión"
            onClick={() => {
              localStorage.removeItem("token"); // Borras el token
              window.location.href = "/"; // Rediriges a la raíz (donde tienes el login)
            }}
          >
            <img src={cerrar_sesion} alt="Cerrar sesión" />
          </button>
        </div>
      </aside>
    </>
  );
};

export default MenuLateral;
