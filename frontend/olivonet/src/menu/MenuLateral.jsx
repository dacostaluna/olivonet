import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonMenu from "./BotonMenu";
import "./MenuLateral.css";

import logo from "../assets/olivonet-icon.png";
import flecha from "../assets/flecha-izquierda.png";
import cerrar_sesion from "../assets/cerrar-sesion.png";

import home from "../assets/menu/home.png";
import chat from "../assets/menu/chat.png";
import coop from "../assets/menu/olives.png";
import propiedades from "../assets/menu/tree2.png";



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
    setMenuAbierto(nuevoEstado);
  };

  return (
    <>
      <button
        className={`boton-toggle-flotante ${abierto ? "abierto" : "cerrado"}`}
        onClick={alternarMenu}
        title="Alternar menú lateral"
      >
        <img
          src={flecha}
          alt="Desplegar menú"
          className={`icono-flecha ${abierto ? "rotada" : ""}`}
        />
      </button>
      <aside className={`menu-lateral ${abierto ? "abierto" : "cerrado"}`}>
        <div className="cabecera-menu-lateral">
          <img src={logo} alt="Logo" className="logo-menu" />
        </div>

        <hr className="separador-horizontal" />
        <div className="contenedor-botones">
          <BotonMenu
            texto="Inicio"
            icono={home}
            activo={activo === "inicio"}
            onClick={() => manejarClick("inicio")}
          />
          <BotonMenu
            texto="Propiedades"
            icono={propiedades}
            activo={activo === "propiedades"}
            onClick={() => manejarClick("propiedades")}
          />
          <BotonMenu
            texto="Cooperativa"
            icono={coop}
            activo={activo === "cooperativa"}
            onClick={() => manejarClick("cooperativa")}
          />
          <BotonMenu
            texto="OliBot"
            icono={chat}
            activo={activo === "chat"}
            onClick={() => manejarClick("chat")}
          />
          <BotonMenu
            texto="Perfil"
            icono="https://cdn-icons-png.flaticon.com/512/747/747376.png"
            activo={activo === "perfil"}
            onClick={() => manejarClick("perfil")}
          />
        </div>
        <div className="menu-abajo">
          <div className="contenedor-boton-cerrar-sesion-agricultor">
            <button
              className="boton-simple cuadrado cerrar-sesion"
              title="Cerrar sesión"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
            >
              <img src={cerrar_sesion} alt="Cerrar sesión" />
            </button>
            <a>Cerrar sesión</a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MenuLateral;
