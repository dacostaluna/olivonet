import React, { useState, useEffect } from "react";
import CuadroBusqueda from "./CuadroBusqueda";
import ResultadoBusqueda from "./ResultadoBusqueda";
import ModalAsociarAgricultor from "./ModalAsociarAgricultor";
import "./InicioCooperativa.css";

const InicioCooperativa = () => {
  const [agricultores, setAgricultores] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const fetchAgricultores = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/cooperativa/obtenerAgricultores",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        setAgricultores(data);
      } else if (Array.isArray(data.agricultores)) {
        setAgricultores(data.agricultores);
      } else {
        setAgricultores([]);
      }
    } catch (error) {
      console.error("Error al obtener agricultores:", error);
      setAgricultores([]);
    }
  };

  useEffect(() => {
    fetchAgricultores();
  }, []);

  const handleBusqueda = async (termino) => {
    setTerminoBusqueda(termino);

    if (!termino || termino.trim() === "") {
      try {
        await fetchAgricultores(); 
      } catch {
        setAgricultores([]);
      }
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/cooperativa/buscarAgricultor/${encodeURIComponent(
          termino
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAgricultores([data]);
      } else {
        setAgricultores([]);
      }
    } catch (error) {
      console.error("Error en búsqueda:", error);
      setAgricultores([]);
    }
  };

  const handleInputChange = (nuevoValor) => {
    setTerminoBusqueda(nuevoValor);
  };

  const handleAgricultorAsociado = async () => {
    await fetchAgricultores();
    setMostrarModal(false); 
  };

  return (
    <div className="busqueda-agricultor-container">
      <CuadroBusqueda
        valor={terminoBusqueda}
        onChange={handleInputChange}
        onBuscar={() => handleBusqueda(terminoBusqueda)}
      />
      <ResultadoBusqueda agricultores={agricultores} />
      <button
        className="boton-flotante-asociar"
        onClick={() => setMostrarModal(true)}
        aria-label="Asociar agricultor"
      >
        +
      </button>
      {mostrarModal && (
        <ModalAsociarAgricultor
          onClose={() => setMostrarModal(false)}
          onAsociado={handleAgricultorAsociado}
        />
      )}
    </div>
  );
};

export default InicioCooperativa;
