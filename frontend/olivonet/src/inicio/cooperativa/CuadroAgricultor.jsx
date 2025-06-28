import "./CuadroAgricultor.css";
import fotoDefault from "../../assets/default_perfil.jpg";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTimes } from "react-icons/fa"; // íconos bonitos

const CuadroAgricultor = ({ agricultor, onDesasociar }) => {
  const {
    nombre,
    apellidos,
    correo,
    dni,
    username,
    fechaNacimiento,
    fotoPerfil,
    id,
  } = agricultor;

  const navigate = useNavigate();

  const manejarAbrirCosechas = () => {
  navigate(`/cosechas/${id}`, { state: { agricultor } });
};


  const manejarDesasociar = async () => {
    const confirmar = window.confirm(
      `¿De verdad quieres desasociar a ${nombre} ${apellidos}?`
    );
    if (!confirmar) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert(
        "No se encontró el token de autenticación. Inicia sesión de nuevo."
      );
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/cooperativa/desasociar/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Agricultor desasociado correctamente");
        if (onDesasociar) onDesasociar(id); 
      } else {
        alert(
          `Error al desasociar al agricultor: ${
            data.message || "Error desconocido"
          }`
        );
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Error en la solicitud al servidor");
    }
  };

  return (
    <div className="cuadro-agricultor">
      <div className="foto-perfil-vista-coop">
        <img src={fotoPerfil || fotoDefault} alt="Foto perfil" />
      </div>

      <div className="info-agricultor">
        <h3>
          {nombre} {apellidos}
        </h3>
        <p>
          <strong>Correo:</strong> {correo}
        </p>
        <p>
          <strong>DNI:</strong> {dni}
        </p>
        <p>
          <strong>Usuario:</strong> {username}
        </p>
        <p>
          <strong>Fecha de nacimiento:</strong>{" "}
          {new Date(fechaNacimiento).toLocaleDateString()}
        </p>
      </div>

      <div className="botones-agricultor">
        <button
          title="Añadir cosechas"
          className="boton-agricultor añadir"
          onClick={manejarAbrirCosechas}
        >
          <FaPlus />
        </button>
        <button
          title="Desasociar agricultor"
          className="boton-agricultor eliminar"
          onClick={manejarDesasociar}
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default CuadroAgricultor;
