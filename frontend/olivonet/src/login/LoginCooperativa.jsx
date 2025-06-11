import React, { useState } from "react";
import axios from "axios";

const LoginCooperativa = ({ onLogin, onBack }) => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!correo.trim() || !password.trim()) {
      setError("Por favor, introduce correo y contraseña.");
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
      setError("");
      if (onLogin) onLogin(token);

      navigate("/inicio");
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cuadro-login">
      <h2 className="titulo-login">INICIA SESIÓN COMO COOPERATIVA</h2>

      <input
        type="email"
        placeholder="Correo electrónico"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="mensaje-error">{error || "\u00A0"}</div>

      <button onClick={handleLogin} disabled={loading}>Iniciar sesión</button>

      <button onClick={onBack} style={{ marginTop: "10px" }}>Volver</button>
    </div>
  );
};

export default LoginCooperativa;
