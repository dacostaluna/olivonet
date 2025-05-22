import React, { useEffect } from "react";
import "./SesionExpirada.css";

const SesionExpirada = ({ onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Sesión caducada</h2>
        <hr></hr>
        <p>Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.</p>
        <button onClick={onClose}>Aceptar</button>
      </div>
    </div>
  );
};

export default SesionExpirada;
