import React, { useState } from "react";
import axios from "axios";
import "./RegistroModal.css";
import Formulario from "../extra/Formulario";
import Espacio from "../extra/Espacio";

const RegistroModal = ({ visible, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    dni: "",
    username: "",
    password: "",
    repeatPassword: "",
    fechaNacimiento: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cerrando, setCerrando] = useState(false);


  if (!visible) return null;

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const cerrarModal = () => {
    setCerrando(true);
    setTimeout(() => {
        setCerrando(false);
        onClose(); // desmonta el modal completamente
    }, 300); // duración de la animación
    };


  const handleRegistro = async () => {
    const { nombre, apellidos, correo, dni, username, password, repeatPassword, fechaNacimiento } = formData;

    setError("");
    setSuccess("");

    if (!nombre || !apellidos || !correo || !dni || !username || !password || !repeatPassword || !fechaNacimiento) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        nombre,
        apellidos,
        correo,
        dni,
        username,
        password,
        fechaNacimiento,
      });
      setSuccess("Cuenta creada exitosamente.");
      setTimeout(onClose, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar");
    }
  };

  return (
    <div className="modal-overlay">
      <div className={`modal-contenido ${cerrando ? "desaparecer-modal" : "animar-modal"}`}>
        <button className="cerrar-x" onClick={cerrarModal}>×</button>
        <h2 className="titulo">REGÍSTRATE</h2>
        <Espacio altura="0.7vw"/>
        <div className="columnas-formulario">
          <div className="columna">
            <Formulario texto="Nombre" value={formData.nombre} onChange={handleChange("nombre")} />
            <Formulario texto="Apellidos" value={formData.apellidos} onChange={handleChange("apellidos")} />
            <Formulario texto="Correo electrónico" value={formData.correo} onChange={handleChange("correo")} />
            <Formulario texto="Documento de Identidad (DNI)" value={formData.dni} onChange={handleChange("dni")} />
          </div>
          <Espacio anchura="40px"/>
          <div className="columna">
            <Formulario texto="Nombre de usuario" value={formData.username} onChange={handleChange("username")} />
            <Formulario texto="Contraseña" type="password" value={formData.password} onChange={handleChange("password")} />
            <Formulario texto="Repite la contraseña" type="password" value={formData.repeatPassword} onChange={handleChange("repeatPassword")} />
            <Formulario texto="Fecha de Nacimiento" type="date" value={formData.fechaNacimiento} onChange={handleChange("fechaNacimiento")} />
          </div>
        </div>
        <div className={`mensaje-feedback ${error ? 'error' : success ? 'success' : ''}`}>
            {error || success || "\u00A0"}
        </div>
        <Espacio />
        <div className="boton-centro">
          <button className="boton-login" onClick={handleRegistro}>Crear Cuenta</button>
        </div>
      </div>
    </div>
  );
};

export default RegistroModal;
