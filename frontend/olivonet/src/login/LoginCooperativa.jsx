// LoginCooperativa.jsx
import React from "react";

const LoginCooperativa = ({ onLogin }) => {
  const handleLogin = () => {
    const token = "coop-token-ejemplo";
    localStorage.setItem("coopToken", token);
    if (onLogin) onLogin(token);
  };

  return (
    <div>
      <h1>Login Cooperativa</h1>
      <button onClick={handleLogin}>Iniciar sesión como cooperativa</button>
    </div>
  );
};

export default LoginCooperativa;
