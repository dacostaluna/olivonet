import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Login.css";
import Formulario from "../extra/Formulario";
import Espacio from "../extra/Espacio";

import logo from "../assets/olivonet-icon3.png";
import videoFondo from "../assets/video_fondo.mp4";
import RegistroModal from "../registro/RegistroModal";
import Mensaje from "../extra/Mensaje";

import LoginCooperativa from "./LoginCooperativa";


const Login = ({ onLogin }) => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoCooperativa, setModoCooperativa] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!correo.trim() || !password.trim()) {
      setMensaje({ texto: "Por favor, introduce correo y contraseña", tipo: "error" });
      return;
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo)) {
      setMensaje({ texto: "Por favor, introduce un correo válido", tipo: "error" });
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
      setMensaje({ texto: "", tipo: "exito" });
      if (onLogin) onLogin(token);

      navigate("/inicio");
    } catch (err) {
      setMensaje({ texto: err.response?.data?.message, tipo: "error" });
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

      {!modoCooperativa ? (
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


          <Espacio altura="5%" />

          <button className="boton-login" onClick={handleLogin} disabled={loading}>
            {"Iniciar sesión"}
          </button>
          <p className="texto">o crea una cuenta nueva</p>

          <Espacio altura="4%" />
          <button className="crear-cuenta" onClick={() => setMostrarModal(true)}>Crear cuenta</button>

          <Espacio altura="2%" />
          {mensaje && <Mensaje tipo={mensaje.tipo} texto={mensaje.texto} />}

        </div>
      ) : (
        <LoginCooperativa onLogin={onLogin} onBack={() => setModoCooperativa(false)} />
      )}

      <div className="fondo-login">
        <h1>La comunidad que une a agricultores y cooperativas ha llegado</h1>
        <div className="logo">
          <img src={logo} alt="OlivoNET" />
        </div>
      </div>

      <RegistroModal visible={mostrarModal} onClose={() => setMostrarModal(false)} />

      <button
        className="boton-flotante-login"
        onClick={() => setModoCooperativa(!modoCooperativa)}
        aria-label="Cambiar tipo de login"
      >
        {modoCooperativa ? "¿Eres agricultor?" : "¿Eres cooperativa?"}
      </button>
    </div>
  );
};

export default Login;
