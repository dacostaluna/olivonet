import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Login.css";
import Formulario from "../extra/Formulario";
import Espacio from "../extra/Espacio";

import logo from "../assets/olivonet-icon3.png";
import videoFondo from "../assets/video_fondo.mp4";
import RegistroModal from "../registro/RegistroModal";


const Login = ({ onLogin }) => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();


  const handleLogin = async () => {
    if (!correo.trim() || !password.trim()) {
      setError("Por favor, introduce correo y contraseña.");
      return;
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo)) {
      setError("Por favor, introduce un correo válido.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        correo,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      setError("");
      if (onLogin) onLogin(token); // Notifica al componente padre que el login fue exitoso

      navigate("/inicio");

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pagina-login">
      <video autoPlay loop muted playsInline className="video-fondo">
        <source src={videoFondo} type="video/mp4" />
        Tu navegador no soporta el video.
      </video>

      <div className="cuadro-login">
        <h2 className="titulo-login">INICIA SESIÓN</h2>

        <Espacio altura="5%" />
        <Formulario
          texto="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <Espacio />
        <Formulario
          texto="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <a href="#" className="forgot-password">
          ¿Olvidaste la contraseña?
        </a>

        <div className="mensaje-error">{error || "\u00A0"}</div>

        <Espacio altura="5%" />

        <button className="boton-login" onClick={handleLogin} disabled={loading}>
          {"Iniciar sesión"}
        </button>
        <p className="texto">o crea una cuenta nueva</p>

        <Espacio altura="4%" />
        <button className="crear-cuenta" onClick={() => setMostrarModal(true)}>Crear cuenta</button>

        <Espacio altura="2%" />
      </div>

      <div className="fondo-login">
        <h1>La comunidad que une a agricultores y cooperativas ha llegado</h1>
        <div className="logo">
          <img src={logo} alt="OlivoNET" />
        </div>
      </div>
      <RegistroModal visible={mostrarModal} onClose={() => setMostrarModal(false)} />
    </div>
  );
};

export default Login;
