import React, { useState } from "react";
import axios from "axios";
import Mensaje from "../extra/Mensaje";
import Espacio from "../extra/Espacio";
import Formulario from "../extra/Formulario";
import "./ModalCrearPropiedad.css";

// Convierte un string a un número hash
const hashStringToNumber = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const generarColorAleatorio = (texto) => {
  const hashStringToNumber = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  if (!texto) return "#789048"; // fallback por si algo va mal

  const hash = hashStringToNumber(texto);

  const hue = hash % 360; // 0 a 359 → todos los colores posibles
  const saturation = 50 + (hash % 30); // 50% a 80% de saturación (bonito)
  const lightness = 45 + ((hash >> 3) % 20); // 45% a 65% de luminosidad

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};



const ModalCrearPropiedad = ({ onCerrar, onCrearExito }) => {
  const [nuevaPropiedad, setNuevaPropiedad] = useState({
    nombre: "",
    numOlivos: "",
    descripcion: "",
    superficie: "",
    coordenadas: "",
    direccion: "",
    tieneRiego: false,
    numOlivosRiego: "",
    variedad: "",
    edadOlivos: "",
  });

  const [mensaje, setMensaje] = useState(null);

  const handleInputChange = (campo) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setNuevaPropiedad((prev) => ({
      ...prev,
      [campo]: value,
    }));

    setMensaje(null); // limpiar mensaje al cambiar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const camposObligatorios = ["nombre", "superficie", "numOlivos"];
    for (const campo of camposObligatorios) {
      const valor = nuevaPropiedad[campo];
      if (!valor || valor.toString().trim() === "") {
        setMensaje({
          texto: `El campo ${campo} es obligatorio`,
          tipo: "error",
        });
        return;
      }
    }

    if (
      nuevaPropiedad.tieneRiego &&
      Number(nuevaPropiedad.numOlivosRiego) > Number(nuevaPropiedad.numOlivos)
    ) {
      setMensaje({
        texto:
          "El número de olivos con riego no puede superar el total de olivos.",
        tipo: "error",
      });
      return;
    }

    const propiedadConColor = {
      ...nuevaPropiedad,
      color: generarColorAleatorio(nuevaPropiedad.nombre),
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/crear-propiedad",
        propiedadConColor,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMensaje({ texto: "Propiedad creada con éxito", tipo: "exito" });

      setNuevaPropiedad({
        nombre: "",
        numOlivos: "",
        descripcion: "",
        superficie: "",
        coordenadas: "",
        direccion: "",
        tieneRiego: false,
        numOlivosRiego: "",
        variedad: "",
        edadOlivos: "",
      });

      if (onCrearExito) onCrearExito();

      setTimeout(() => {
        onCerrar();
        setMensaje(null);
      }, 1500);
    } catch (error) {
      setMensaje({
        texto: error.response?.data?.message || "Error al crear la propiedad.",
        tipo: "error",
      });
    }
  };

  return (
    <div className="modal-crearprop-fondo" onClick={onCerrar}>
      <div
        className="modal-crearprop-contenido"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-crearprop-cerrar"
          onClick={onCerrar}
          aria-label="Cerrar modal"
        >
          ×
        </button>
        <h2 className="modal-crearprop-titulo">Crear Nueva Propiedad</h2>

        <form onSubmit={handleSubmit}>
          <div className="modal-crearprop-formulario">
            <div className="modal-crearprop-columna">
              <Formulario
                texto="Nombre"
                value={nuevaPropiedad.nombre}
                onChange={handleInputChange("nombre")}
                required
              />
              <div className="olivos-superficie-contenedor">
                <Formulario
                  texto="Número de Olivos"
                  placeholder="Ej: 100"
                  type="number"
                  value={nuevaPropiedad.numOlivos}
                  onChange={handleInputChange("numOlivos")}
                  required
                />
                <Formulario
                  texto="Superficie"
                  placeholder="Ej: 22 m²"
                  type="number"
                  value={nuevaPropiedad.superficie}
                  onChange={handleInputChange("superficie")}
                  required
                />
              </div>

              <div className="riego-contenedor">
                <Formulario
                  texto="¿Tiene Riego?"
                  type="checkbox"
                  value={nuevaPropiedad.tieneRiego}
                  onChange={handleInputChange("tieneRiego")}
                />

                <Espacio anchura="1vw" />

                <Formulario
                  texto="Olivos con Riego"
                  placeholder="Ej: 50"
                  type="number"
                  value={nuevaPropiedad.numOlivosRiego}
                  onChange={handleInputChange("numOlivosRiego")}
                  disabled={!nuevaPropiedad.tieneRiego}
                />
              </div>
            </div>

            <div className="modal-crearprop-columna">
              <Formulario
                texto="Dirección"
                placeholder="Dirección completa"
                value={nuevaPropiedad.direccion}
                onChange={handleInputChange("direccion")}
              />
              <div className="variedad-edad-contenedor">
                <Formulario
                  texto="Variedad"
                  type="select"
                  value={nuevaPropiedad.variedad}
                  onChange={handleInputChange("variedad")}
                  opciones={["Picual", "Hojiblanca", "Arbequina", "Cornicabra"]}
                />
                <Formulario
                  texto="Edad de los Olivos"
                  type="number"
                  placeholder="Ej: 5"
                  value={nuevaPropiedad.edadOlivos}
                  onChange={handleInputChange("edadOlivos")}
                />
              </div>

              <Formulario
                texto="Descripción"
                value={nuevaPropiedad.descripcion}
                onChange={handleInputChange("descripcion")}
                height="1.7rem"
                esArea={true}
              />
            </div>
          </div>

          <button type="submit" className="modal-crearprop-confirmar">
            Guardar
          </button>

          <Mensaje tipo={mensaje?.tipo} texto={mensaje?.texto} />
        </form>
      </div>
    </div>
  );
};

export default ModalCrearPropiedad;
