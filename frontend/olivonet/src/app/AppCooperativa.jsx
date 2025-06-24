import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Routes, Route, useNavigate } from "react-router-dom";
import cerrar_sesion from "../assets/cerrar-sesion.png";
import EncabezadoCooperativa from "../inicio/cooperativa/EncabezadoCooperativa.jsx";

import "./AppCooperativa.css";
import logo from "../assets/olivonet-icon3.png";
import InicioCooperativa from "../inicio/cooperativa/InicioCooperativa.jsx";
import CosechasAgricultor from "../cosechas/CosechasAgricultor";


const BotonLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <button
      className="boton-cerrar-sesion-coop cuadrado cerrar-sesion"
      title="Cerrar sesión"
      onClick={handleLogout}
    >
      <img src={cerrar_sesion} alt="Cerrar sesión" />
    </button>
  );
};

const AppCooperativa = () => {
  const [estado, setEstado] = useState("cargando");
  const [idCooperativa, setIdCooperativa] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setEstado("invalido");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.tipo === "cooperativa") {
        setEstado("valido");
        setIdCooperativa(decoded.id);
      } else {
        setEstado("invalido");
      }
    } catch (e) {
      console.error("Error decodificando token", e);
      setEstado("invalido");
    }
  }, []);

  if (estado === "cargando") return <div>Cargando...</div>;
  if (estado === "invalido") return <div>No autorizado.</div>;

  return (
    <div className="app-coop-container">
      <div className="barra-arriba-coop">
        <div className="cabecera-cooperativa">
          <img src={logo} alt="Logo" className="logo-menu-coop" />
          <div className="encabezado-wrapper">
            <EncabezadoCooperativa tipoUsuario="cooperativa" />
          </div>
          <div className="contenedor-cerrar-sesion-coop">
            <BotonLogout />
            <a>Cerrar sesión</a>
          </div>
        </div>
      </div>

      <div className="contenido-cooperativa">
        <Routes>
          <Route path="inicio" element={<InicioCooperativa />} />
          <Route path="/cosechas/:id" element={<CosechasAgricultor />} />
        </Routes>
      </div>
    </div>
  );
};

export default AppCooperativa;
