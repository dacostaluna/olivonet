import React, { useState } from "react";
import axios from "axios";
import "./EliminarCuenta.css";

const EliminarCuenta = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleEliminarCuenta = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/eliminar-mi-cuenta", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Cuenta eliminada correctamente.");
      localStorage.removeItem("token"); // o sessionStorage.removeItem("token");
      window.location.reload();

    } catch (error) {
      alert("Error al eliminar la cuenta.");
    }
  };

  return (
    <>
      <button
        className="btn-eliminar-cuenta"
        onClick={() => setModalVisible(true)}
      >
        Eliminar cuenta
      </button>

      {modalVisible && (
        <div className="modal-overlay-borrar-cuenta">
          <div className="modal-contenido-borrar-cuenta animar-modal">
            <button className="cerrar-x-borrar-cuenta" onClick={() => setModalVisible(false)}>
              ×
            </button>
            <h2 className="titulo rojo">ATENCIÓN</h2>
            <p>
              Ten en cuenta que{" "}
              <strong>TODA tu información almacenada en el sistema</strong> se
              eliminará por completo, perdiendo así el acceso a esta cuenta.
            </p>
            <p>Si quieres continuar haz clic en el siguiente botón:</p>
            <div className="boton-centro">
              <button
                className="btn-confirmar-eliminacion"
                onClick={handleEliminarCuenta}
              >
                ELIMINAR CUENTA
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EliminarCuenta;
