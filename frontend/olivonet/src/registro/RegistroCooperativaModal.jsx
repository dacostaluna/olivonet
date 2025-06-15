import React, { useState } from "react";
import axios from "axios";
// import "./RegistroCooperativaModal.css";
import Formulario from "../extra/Formulario";
import Espacio from "../extra/Espacio";

const RegistroCooperativaModal = ({ visible, onClose }) => {
  const [cerrando, setCerrando] = useState(false);
  if (!visible) return null;

  const cerrarModal = () => {
    setCerrando(true);
    setTimeout(() => {
      setCerrando(false);
      onClose();
    }, 300);
  };

  return (
    <div className="modal-overlay">
      <div
        className={`modal-contenido ${
          cerrando ? "desaparecer-modal" : "animar-modal"
        }`}
      >
        <button className="cerrar-x" onClick={cerrarModal}>
          ×
        </button>
        <h2 className="titulo">REGISTRO DE COOPERATIVA</h2>
        <p className="mensaje-modal-registro-cooperativa">
          Para registrar una cooperativa, póngase en contacto con el correo{" "}
          <strong>cooperativas@olivonet.com</strong>,
          donde validaremos su solicitud y le proporcionaremos acceso a la plataforma.
        </p>
      </div>
    </div>
  );
};

export default RegistroCooperativaModal;
