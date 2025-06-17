// ModalAsociarAgricultor.jsx
import React, { useState } from "react";
import "./ModalAsociarAgricultor.css";
import Formulario from "../../extra/Formulario";
import Mensaje from "../../extra/Mensaje";

const ModalAsociarAgricultor = ({ onClose, onAsociado }) => {
  const [termino, setTermino] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5000/cooperativa/asociarAgricultor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ termino }),
        }
      );

      if (response.ok) {
        setMensaje("Agricultor asociado correctamente");
        setTipoMensaje("exito");
        setTermino("");
        if (onAsociado) {
          await onAsociado();
        }

        setTimeout(() => {
          setMensaje("");
          onClose();
        }, 1000);
      } else {
        const error = await response.json();
        setMensaje(error.message || "Error al asociar agricultor");
        setTipoMensaje("error");
      }
    } catch (err) {
      console.error(err);
      setMensaje("Error al conectar con el servidor");
      setTipoMensaje("error");
    }
  };

  return (
    <div className="modal-overlay-asociar">
      <div className="modal-contenido-asociar">
        <button className="cerrar-asociar" onClick={onClose}>
          ×
        </button>
        <h2>Asociar Agricultor</h2>
        <p>
          Introduce el DNI o el correo del agricultor que deseas asociar a la cooperativa.
        </p>

        <form onSubmit={handleSubmit}>
          <Formulario
            texto="DNI / Correo del Agricultor"
            placeholder="12345678A"
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
          />
          <button type="submit" className="btn-asociar">
            Asociar
          </button>
        </form>
        <Mensaje tipo={tipoMensaje} texto={mensaje} />
      </div>
    </div>
  );
};

export default ModalAsociarAgricultor;
