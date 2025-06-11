import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Routes, Route, useNavigate } from "react-router-dom";
import cerrar_sesion from "../assets/cerrar-sesion.png"; // ajusta el path si es necesario

// Componentes de ejemplo
const Dashboard = () => <h2>Panel de Cooperativa</h2>;
const Productos = () => <h2>Gestión de Productos</h2>;

// Botón de logout
const BotonLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"
  };

  return (
    <button
      className="boton-simple cuadrado cerrar-sesion"
      title="Cerrar sesión"
      onClick={handleLogout}
    >
      <img src={cerrar_sesion} alt="Cerrar sesión" />
    </button>
  );
};

const AppCooperativa = () => {
  const [estado, setEstado] = useState("cargando"); // "cargando", "valido", "invalido"

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setEstado("invalido");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("Token decodificado:", decoded);

      if (decoded.tipo === "cooperativa") {
        setEstado("valido");
      } else {
        setEstado("invalido");
      }
    } catch (e) {
      console.error("Error decodificando token", e);
      setEstado("invalido");
    }
  }, []);

  if (estado === "cargando") {
    return <div>Cargando...</div>;
  }

  if (estado === "invalido") {
    return <div>No autorizado. Por favor inicia sesión como cooperativa.</div>;
  }

  return (
    <div>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Bienvenida, Cooperativa</h1>
        <BotonLogout />
      </header>

      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="productos" element={<Productos />} />
        {/* Puedes añadir más rutas aquí */}
      </Routes>
    </div>
  );
};

export default AppCooperativa;
