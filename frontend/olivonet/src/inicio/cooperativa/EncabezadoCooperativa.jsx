import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EncabezadoCooperativa.css";
import defaultProfilePic from "../../assets/default_perfil.jpg";

const EncabezadoCooperativa = ({ tipoUsuario, style = {}, className = "" }) => {
  const [datos, setDatos] = useState(null);
  const [hoverFoto, setHoverFoto] = useState(false);
  const [foto, setFoto] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const handleSubirFoto =
    tipoUsuario === "cooperativa"
      ? async (e) => {
          const archivo = e.target.files[0];
          if (!archivo) return;

          const formData = new FormData();
          formData.append("foto", archivo);

          try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
              "http://localhost:5000/cooperativa/foto",
              formData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            setFoto(res.data.fotoPerfil);
            setMensaje({ texto: "Foto actualizada con éxito", tipo: "exito" });
          } catch (err) {
            setMensaje({ texto: "Error subiendo foto.", tipo: "error" });
          }
        }
      : null;

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const token = localStorage.getItem("token");
        let res;

        if (tipoUsuario === "cooperativa") {
          res = await axios.get("http://localhost:5000/cooperativa/perfil", {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else if (tipoUsuario === "agricultor") {
          res = await axios.get(`http://localhost:5000/mi-cooperativa`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        if (res) {
          setDatos(res.data);
          setFoto(res.data.fotoPerfil || null);
        }
      } catch (err) {
        console.error(`Error al obtener datos del ${tipoUsuario}:`, err);
      }
    };

    fetchDatos();
  }, [tipoUsuario]);

  if (!datos) return <p>Cargando {tipoUsuario}...</p>;

  return (
    <div
      className={`encabezado-coop-container ${className}`}
      style={style}
    >
      <div className="info-coop">
        <h1 className="coop-nombre">{datos.nombre}</h1>
        <p className="coop-direccion">{datos.direccion}</p>
        <p className="coop-correo">{datos.correo}</p>
      </div>

      <div
        className="foto-perfil-wrapper"
        onMouseEnter={() => tipoUsuario === "cooperativa" && setHoverFoto(true)}
        onMouseLeave={() =>
          tipoUsuario === "cooperativa" && setHoverFoto(false)
        }
      >
        <img
          src={foto || defaultProfilePic}
          alt="Foto de perfil"
          className="foto-perfil"
        />
        {hoverFoto && tipoUsuario === "cooperativa" && (
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
    </div>
  );
};

export default EncabezadoCooperativa;
