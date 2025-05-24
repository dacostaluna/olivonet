import React, { useEffect, useState } from "react";
import CampoEditable from "./CampoEditable.jsx";
import axios from "axios";
import "./Perfil.css";
import Espacio from "../extra/Espacio.jsx";
import EliminarCuenta from "./EliminarCuenta.jsx";

const Perfil = () => {
  const [datosOriginales, setDatosOriginales] = useState(null);
  const [datosEditados, setDatosEditados] = useState(null);
  const [mensaje, setMensaje] = useState(null);          // mensaje { texto: string, tipo: "error" | "exito" }

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/mi-perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDatosOriginales(res.data);
        setDatosEditados(res.data);
      } catch (error) {
        console.error("Error cargando perfil:", error);
      }
    };
    fetchPerfil();
  }, []);

  const handleCampoChange = (campo, valor) => {
    setDatosEditados((prev) => ({ ...prev, [campo]: valor }));
  };

  const seHaModificado =
    JSON.stringify(datosOriginales) !== JSON.stringify(datosEditados);

  const handleGuardar = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/actualizarUsuario", datosEditados, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDatosOriginales(datosEditados);
      setMensaje({ texto: "Perfil actualizado con éxito", tipo: "exito" });
    } catch (err) {
      console.error("Error actualizando perfil:", err);
      // Intentamos extraer mensaje de error del backend
      const textoError =
        err.response?.data?.message ||
        "Error al actualizar perfil, inténtalo de nuevo.";
      setMensaje({ texto: textoError, tipo: "error" });
    }
  };

  if (!datosEditados) return <p>Cargando...</p>;

  return (
    <div className="perfil-container">
      <h2 className="perfil-titulo">Mi Perfil</h2>
      <Espacio altura="1vw" />
      <CampoEditable
        titulo="Nombre"
        valorInicial={datosEditados.nombre}
        editable={true}
        onChange={(val) => handleCampoChange("nombre", val)}
      />

      <CampoEditable
        titulo="Apellidos"
        valorInicial={datosEditados.apellidos}
        editable={true}
        onChange={(val) => handleCampoChange("apellidos", val)}
      />

      <CampoEditable
        titulo="Correo"
        valorInicial={datosEditados.correo}
        editable={true}
        onChange={(val) => handleCampoChange("correo", val)}
      />

      <CampoEditable
        titulo="Username"
        valorInicial={datosEditados.username}
        editable={true}
        onChange={(val) => handleCampoChange("username", val)}
      />

      <CampoEditable
        titulo="DNI"
        valorInicial={datosEditados.dni}
        editable={false}
        onChange={() => {}}
      />

      <CampoEditable
        titulo="Fecha de nacimiento"
        valorInicial={new Date(datosEditados.fechaNacimiento).toLocaleDateString()}
        editable={false}
        onChange={() => {}}
      />

      <CampoEditable
        titulo="Cuenta creada el"
        valorInicial={new Date(datosEditados.createdAt).toLocaleDateString()}
        editable={false}
        onChange={() => {}}
      />

      <button
        disabled={!seHaModificado}
        onClick={handleGuardar}
        className={`boton-guardar ${seHaModificado ? "activo" : "inactivo"}`}
      >
        Guardar Cambios
      </button>

      <Espacio altura="0.5vw" />
      {mensaje && (
        <p className={`mensaje ${mensaje.tipo === "error" ? "error" : "exito"}`}>
          {mensaje.texto}
        </p>
      )}

      <Espacio altura="1vw" />
      <h2 className="eliminar-titulo">Eliminar cuenta</h2>
      <p className="perfil-informacion">
        Puedes eliminar tu cuenta de forma permanente.
      </p>
      <p className="perfil-informacion">
        Ten en cuenta que esta acción <strong>no se puede deshacer y que se eliminarán todos tus datos</strong> asociados a las cooperativas y a tu perfil.
      </p>
      <Espacio altura="1vw" />
      <EliminarCuenta />
    </div>
  );
};

export default Perfil;
