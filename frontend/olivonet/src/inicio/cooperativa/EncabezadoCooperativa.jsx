import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EncabezadoCooperativa.css";
import defaultProfilePic from "../../assets/default_perfil.jpg"; // Imagen genérica


const EncabezadoCooperativa = ({ id }) => {
  const [cooperativa, setCooperativa] = useState(null);
  const [hoverFoto, setHoverFoto] = useState(false);
  const [foto, setFoto] = useState(null);

    const handleSubirFoto = async (e) => {
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
      setMensaje({
        texto: "Foto actualizada con éxito",
        tipo: "exito",
      });
    } catch (err) {
      setMensaje({ texto: "Error subiendo foto.", tipo: "error" });
    }
  };


  useEffect(() => {

    const fetchCooperativa = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/cooperativa/perfil`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCooperativa(res.data);
        setFoto(res.data.fotoPerfil || null);
      } catch (err) {
        console.error("Error al obtener datos de la cooperativa:", err);
      }
    };

    if (id) {
      fetchCooperativa();
    }
  }, [id]);

  if (!cooperativa) return <p>Cargando cooperativa...</p>;

  return (
    <div className="encabezado-coop-container">
      <div className="info-coop">
        <h1 className="coop-nombre">{cooperativa.nombre}</h1>
        <p className="coop-direccion">{cooperativa.direccion}</p>
        <p className="coop-correo">{cooperativa.correo}</p>
      </div>
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
    </div>
  );
};

export default EncabezadoCooperativa;
