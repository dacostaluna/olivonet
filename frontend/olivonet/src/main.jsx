import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import { useTokenMonitor } from "./hooks/useTokenMonitor";
import Login from "./login/Login.jsx";
import App from "./app/App.jsx";
import AppCooperativa from "./app/AppCooperativa.jsx";
import SesionExpirada from "./extra/SesionExpirada.jsx";

const Root = () => {
  const { token, expired, userType, clearSession, setToken } = useTokenMonitor();

  return (
    <>
      {token ? (
        userType === "cooperativa" ? (
          <AppCooperativa />
        ) : (
          <App />
        )
      ) : (
        <Login
          onLogin={(newToken) => {
            localStorage.setItem("token", newToken);
            setToken(newToken);
          }}
        />
      )}

      {expired && <SesionExpirada onClose={clearSession} />}
    </>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Root />
    </Router>
  </StrictMode>
);
