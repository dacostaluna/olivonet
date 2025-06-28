import React, { useEffect, useState } from "react";
import axios from "axios";

import "./Perfil.css";

import CampoEditable from "./CampoEditable.jsx";
import Espacio from "../extra/Espacio.jsx";
import EliminarCuenta from "./EliminarCuenta.jsx";
import Mensaje from "../extra/Mensaje.jsx";
import CambiarPassword from "./CambiarPassword.jsx";

import defaultProfilePic from "../assets/default_perfil.jpg";

const Perfil = () => {
  const [datosOriginales, setDatosOriginales] = useState(null);
  const [datosEditados, setDatosEditados] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [foto, setFoto] = useState(null);
  const [hoverFoto, setHoverFoto] = useState(false);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/mi-perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDatosOriginales(res.data);
        setDatosEditados(res.data);
        setFoto(res.data.fotoPerfil || null);
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
      await axios.put(
        "http://localhost:5000/actualizarUsuario",
        datosEditados,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDatosOriginales(datosEditados);
      setMensaje({ texto: "Perfil actualizado con éxito", tipo: "exito" });
    } catch (err) {
      const textoError =
        err.response?.data?.message ||
        "Error al actualizar perfil, inténtalo de nuevo.";
      setMensaje({ texto: textoError, tipo: "error" });
    }
  };

  const handleSubirFoto = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    const formData = new FormData();
    formData.append("foto", archivo);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/subir-foto-perfil",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setFoto(res.data.fotoPerfil);
      setMensaje({
        texto: "Foto actualizada con éxito",
        tipo: "exito",
      });
    } catch (err) {
      setMensaje({ texto: "Error subiendo foto.", tipo: "error" });
    }
  };

  if (!datosEditados) return <p>Cargando...</p>;

  const calcularEdad = (fecha) => {
    const nacimiento = new Date(fecha);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  return (
    <div className="perfil-container">
      <h2 className="perfil-titulo">Mi Perfil</h2>
      <Espacio altura="1vw" />

      <div className="perfil-header">
        <div
          className="foto-perfil-wrapper"
          onMouseEnter={() => setHoverFoto(true)}
          onMouseLeave={() => setHoverFoto(false)}
        >
          <img
            src={foto || defaultProfilePic}
            alt="Foto de perfil"
            className="foto-perfil"
          />
          {hoverFoto && (
            <>
              <label htmlFor="file-upload" className="subir-icono-central">
                ✚
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleSubirFoto}
                style={{ display: "none" }}
              />
            </>
          )}
        </div>

        <div className="datos-perfil">
          <h3 className="nombre-perfil">
            {datosEditados.nombre} {datosEditados.apellidos}
          </h3>
          <p className="edad-perfil">
            Agricultor
          </p>
        </div>
      </div>

      <h3>Información personal</h3>
      <p className="perfil-informacion">
        Aquí puedes editar tu información personal. Asegúrate de que todos los
        campos estén correctos y actualizados.
      </p>
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
        valorInicial={new Date(
          datosEditados.fechaNacimiento
        ).toLocaleDateString()}
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
      {mensaje && <Mensaje tipo={mensaje.tipo} texto={mensaje.texto} />}

      <Espacio altura="1vw" />
      <h3>Cambia tu contraseña</h3>
      <p className="perfil-informacion">
        En esta sección puedes cambiar tu contraseña para mantener la seguridad
        de tu cuenta.
      </p>
      <Espacio />
      <CambiarPassword />

      <Espacio altura="1vw" />
      <h3 className="eliminar-titulo">Eliminar cuenta</h3>
      <p className="perfil-informacion">
        Puedes eliminar tu cuenta de forma permanente.
      </p>
      <p className="perfil-informacion">
        Ten en cuenta que esta acción{" "}
        <strong>
          no se puede deshacer y que se eliminarán todos tus datos
        </strong>{" "}
        asociados a las cooperativas y a tu perfil.
      </p>
      <Espacio altura="1vw" />
      <EliminarCuenta />
    </div>
  );
};

export default Perfil;
