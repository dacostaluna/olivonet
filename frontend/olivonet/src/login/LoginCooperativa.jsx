import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Formulario from "../extra/Formulario";
import Espacio from "../extra/Espacio";
import Mensaje from "../extra/Mensaje";
import RegistroCooperativaModal from "../registro/RegistroCooperativaModal";

const LoginCooperativa = ({ onLogin, onBack }) => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

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

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/auth/cooperativa/login", {
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
    <div className="cuadro-login">
      <h2 className="titulo-login">INICIA SESIÓN COMO COOPERATIVA</h2>

      <Formulario
            texto="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
      />
      <Formulario
            texto="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
      />

      <Espacio altura="20px" />

      <button className="boton-login" onClick={handleLogin} disabled={loading}>
        {"Iniciar sesión"}
      </button>
      <p className="texto">o crea una cuenta nueva</p>

      <Espacio altura="3%" />
      <button className="crear-cuenta" onClick={() => setMostrarModal(true)}>Crear cuenta</button>
      {mensaje && <Mensaje tipo={mensaje.tipo} texto={mensaje.texto} />}

      <RegistroCooperativaModal visible={mostrarModal} onClose={() => setMostrarModal(false)} />

    </div>
  );
};

export default LoginCooperativa;
