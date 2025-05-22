import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { useTokenMonitor } from "./hooks/useTokenMonitor";
import Login from "./login/Login.jsx";
import App from "./app/App.jsx";
import SesionExpirada from "./extra/SesionExpirada.jsx";

const Root = () => {
  const { token, expired, clearSession, setToken } = useTokenMonitor();

  return (
    <>
      {token ? (
        <App />
      ) : (
        <Login onLogin={(newToken) => {
          localStorage.setItem("token", newToken);
          setToken(newToken);
        }} />
      )}

      {expired && <SesionExpirada onClose={clearSession} />}
    </>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
