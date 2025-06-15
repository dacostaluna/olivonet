import React from "react";
import EncabezadoCooperativa from "./EncabezadoCooperativa";

// Función para decodificar el payload del token JWT
const obtenerIdCooperativaDesdeToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJSON = atob(payloadBase64);
    const payload = JSON.parse(payloadJSON);
    return payload.id || null;
  } catch (err) {
    console.error("Error decodificando el token:", err);
    return null;
  }
};

const InicioCooperativa = () => {
  const idCooperativa = obtenerIdCooperativaDesdeToken();

  return (
    <div>
      {/* Aquí puedes añadir más contenido del inicio de la cooperativa */}
    </div>
  );
};

export default InicioCooperativa;
