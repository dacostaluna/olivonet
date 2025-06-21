import React, { useState, useEffect } from "react";
import Formulario from "../extra/Formulario";
import Mensaje from "../extra/Mensaje";
import "./ModalAgregarCosecha.css";

const ModalAgregarCosecha = ({ agricultorId, visible, onClose, onAdd }) => {
  const [fecha, setFecha] = useState("");
  const [kilos, setKilos] = useState("");
  const [rendimiento, setRendimiento] = useState("");
  const [numOlivos, setNumOlivos] = useState("");
  const [temporada, setTemporada] = useState("");
  const [propiedad, setPropiedad] = useState("");
  const [propiedades, setPropiedades] = useState([]);

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("exito");

  useEffect(() => {
    if (visible && agricultorId) {
      const token = localStorage.getItem("token");
      fetch(
        `http://localhost:5000/cooperativa/obtenerPropiedades/${agricultorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setPropiedades(data);
          }
        });
    }
  }, [visible, agricultorId]);

  const handleCrearCosecha = () => {
    const propiedadSeleccionada = propiedades.find(
      (p) => p.nombre === propiedad
    );

    if (
      !agricultorId ||
      !propiedadSeleccionada ||
      !fecha ||
      !kilos ||
      !rendimiento ||
      !numOlivos ||
      !temporada
    ) {
      setMensaje("Rellena todos los campos antes de continuar.");
      setTipoMensaje("error");
      return;
    }

    const nuevaCosecha = {
      idAgricultor: agricultorId,
      idPropiedad: propiedadSeleccionada.id,
      fecha,
      kg: parseFloat(kilos),
      rendimiento: parseFloat(rendimiento),
      numOlivos: parseInt(numOlivos),
      temporada: parseInt(temporada),
    };

    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/cooperativa/crearCosecha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(nuevaCosecha),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al guardar cosecha");
        return res.json();
      })
      .then((data) => {
        console.log("Cosecha guardada:", data);
        setMensaje("Cosecha creada correctamente.");
        setTipoMensaje("exito");
        onAdd();

        setTimeout(() => {
          setMensaje("");
          onClose();
        }, 2000);
      })
      .catch((err) => {
        console.error("Error:", err);
        setMensaje("Ocurrió un error al guardar la cosecha.");
        setTipoMensaje("error");
      });
  };

  const limpiarFormulario = () => {
    setFecha("");
    setKilos("");
    setRendimiento("");
    setNumOlivos("");
    setTemporada("");
    setPropiedad("");
    setMensaje("");
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay-cosechas">
      <div className="modal-cosechas">
        <button
          className="cerrar-modal-cosechas"
          onClick={() => {
            onClose();
            limpiarFormulario();
          }}
        >
          ×
        </button>
        <h2>Agregar nueva cosecha</h2>
        <div className="modal-form-cosechas">
          <Formulario
            texto="Fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
          <Formulario
            texto="Kilogramos"
            type="number"
            value={kilos}
            onChange={(e) => setKilos(e.target.value)}
          />
          <Formulario
            texto="Rendimiento"
            type="number"
            value={rendimiento}
            onChange={(e) => setRendimiento(e.target.value)}
          />
          <Formulario
            texto="Nº Olivos"
            type="number"
            value={numOlivos}
            onChange={(e) => setNumOlivos(e.target.value)}
          />
          <Formulario
            texto="Temporada"
            type="number"
            value={temporada}
            onChange={(e) => setTemporada(e.target.value)}
          />
          <Formulario
            texto="Propiedad"
            type="select"
            value={propiedad}
            onChange={(e) => setPropiedad(e.target.value)}
            opciones={propiedades.map((p) => p.nombre)}
            mensajeInicial="Selecciona una propiedad"
          />
        </div>

        <button className="crear-cosecha-btn" onClick={handleCrearCosecha}>
          Crear cosecha
        </button>

        <Mensaje tipo={tipoMensaje} texto={mensaje} />
      </div>
    </div>
  );
};

export default ModalAgregarCosecha;
