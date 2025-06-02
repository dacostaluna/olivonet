import React, { useState } from "react";
import axios from "axios";
import "./CambiarPassword.css";
import Mensaje from "../extra/Mensaje";
import Formulario from "../extra/Formulario";
import Espacio from "../extra/Espacio";

const CambiarPassword = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [campos, setCampos] = useState({
    actual: "",
    nueva: "",
    repetir: "",
  });
  const [mensaje, setMensaje] = useState(null);

  const toggleModal = () => {
    setMostrarModal(!mostrarModal);
    setMensaje(null);
    setCampos({ actual: "", nueva: "", repetir: "" });
  };

  const handleCampo = (campo) => (e) => {
    setCampos((prev) => ({
      ...prev,
      [campo]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones en frontend
    if (!campos.actual || !campos.nueva || !campos.repetir) {
      setMensaje({ texto: "Todos los campos son obligatorios.", tipo: "error" });
      return;
    }
    if (campos.nueva !== campos.repetir) {
      setMensaje({ texto: "Las contraseñas no coinciden.", tipo: "error" });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      // Ahora enviamos actual y nueva
      const res = await axios.put(
        "http://localhost:5000/actualizarUsuario",
        { 
          actual: campos.actual,
          nueva: campos.nueva 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMensaje({ texto: "Contraseña cambiada con éxito.", tipo: "exito" });
      setCampos({ actual: "", nueva: "", repetir: "" });

      setTimeout(toggleModal, 2000);
    } catch (err) {
      const texto = err.response?.data?.message || "Error al cambiar la contraseña.";
      setMensaje({ texto, tipo: "error" });
    }
  };

  return (
    <>
      <button className="btn-cambiar" onClick={toggleModal}>
        Cambia tu contraseña
      </button>

      {mostrarModal && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <span className="cerrar" onClick={toggleModal}>
              &times;
            </span>
            <h3>Cambiar contraseña</h3>
            <form onSubmit={handleSubmit}>
              <Formulario
                texto="Contraseña actual"
                type="password"
                placeholder="Introduce tu contraseña actual"
                value={campos.actual}
                onChange={handleCampo("actual")}
              />
              <Espacio />
              <Formulario
                texto="Nueva contraseña"
                type="password"
                placeholder="Introduce la contraseña nueva"
                value={campos.nueva}
                onChange={handleCampo("nueva")}
              />
              <Formulario
                texto="Repetir contraseña nueva"
                type="password"
                placeholder="Repite la contraseña nueva"
                value={campos.repetir}
                onChange={handleCampo("repetir")}
              />
              <Espacio />
              <button type="submit" className="btn-confirmar">
                Confirmar cambios
              </button>
            </form>
            {mensaje && <Mensaje tipo={mensaje.tipo} texto={mensaje.texto} />}
          </div>
        </div>
      )}
    </>
  );
};

export default CambiarPassword;
