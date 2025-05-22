import React, { useState } from "react";
import BotonMenu from "./BotonMenu";

import "./MenuLateral.css"; // Los estilos los pondremos aquí

import logo from "../assets/olivonet-icon.png";
import flecha from "../assets/flecha-izquierda.png"; // Icono de flecha para el botón de
import cerrar_sesion from "../assets/cerrar-sesion.png"; // Icono de cerrar sesión
import Login from "../login/Login";

const MenuLateral = () => {
  const [activo, setActivo] = useState("inicio"); // estado global del botón activo
  const [abierto, setAbierto] = useState(true); // Menú abierto por defecto

  return (
    <>
      <button
        className={`boton-toggle-flotante ${abierto ? "abierto" : "cerrado"}`}
        onClick={() => setAbierto(!abierto)}
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
            onClick={() => setActivo("inicio")}
          />
          <BotonMenu
            texto="Propiedades"
            icono="https://cdn-icons-png.flaticon.com/512/747/747376.png" // Edificio/casa
            activo={activo === "propiedades"}
            onClick={() => setActivo("propiedades")}
          />
          <BotonMenu
            texto="Cooperativa"
            icono="https://cdn-icons-png.flaticon.com/512/747/747310.png" // Grupo/personas
            activo={activo === "cooperativa"}
            onClick={() => setActivo("cooperativa")}
          />
          <BotonMenu
            texto="Configuración"
            icono="https://cdn-icons-png.flaticon.com/512/126/126472.png" // Engranaje
            activo={activo === "configuracion"}
            onClick={() => setActivo("configuracion")}
          />
          <BotonMenu
            texto="Perfil"
            icono="https://cdn-icons-png.flaticon.com/512/747/747376.png" // Usuario
            activo={activo === "perfil"}
            onClick={() => setActivo("perfil")}
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
              localStorage.removeItem("token"); // ⬅️ Elimina el token
              window.location.reload(); // ⬅️ Recarga la página
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
