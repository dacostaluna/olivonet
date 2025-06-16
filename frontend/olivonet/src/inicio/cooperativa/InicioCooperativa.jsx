import React, { useState, useEffect } from "react";
import CuadroBusqueda from "./CuadroBusqueda";
import ResultadoBusqueda from "./ResultadoBusqueda";
import "./InicioCooperativa.css";

const InicioCooperativa = () => {
  const [agricultores, setAgricultores] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  // Obtener todos los agricultores asociados al cargar el componente
  useEffect(() => {
    const fetchAgricultores = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/cooperativa/obtenerAgricultores",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // o donde guardes el token
            },
          }
        );
        const data = await response.json();

        // Suponiendo que la API devuelve un array directamente
        if (Array.isArray(data)) {
          setAgricultores(data);
        } else if (Array.isArray(data.agricultores)) {
          // O si devuelve { agricultores: [...] }
          setAgricultores(data.agricultores);
        } else {
          setAgricultores([]);
        }
      } catch (error) {
        console.error("Error al obtener agricultores:", error);
        setAgricultores([]);
      }
    };

    fetchAgricultores();
  }, []);

  // Maneja la búsqueda desde CuadroBusqueda
  const handleBusqueda = async (termino) => {
    setTerminoBusqueda(termino);

    if (!termino || termino.trim() === "") {
      // Si el término está vacío, volver a cargar todos los agricultores
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
        if (Array.isArray(data)) setAgricultores(data);
        else if (Array.isArray(data.agricultores))
          setAgricultores(data.agricultores);
        else setAgricultores([]);
      } catch {
        setAgricultores([]);
      }
      return;
    }

    // Buscar agricultor por correo o dni
    try {
      const response = await fetch(
        `http://localhost:5000/cooperativa/buscarAgricultor/${encodeURIComponent(termino)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAgricultores([data]); // El backend devuelve un solo agricultor
      } else {
        setAgricultores([]); // No encontrado o error
      }
    } catch (error) {
      console.error("Error en búsqueda:", error);
      setAgricultores([]);
    }
  };

  const handleInputChange = (nuevoValor) => {
    setTerminoBusqueda(nuevoValor);
  };

  return (
    <div className="busqueda-agricultor-container">
      <CuadroBusqueda
      valor={terminoBusqueda}
      onChange={handleInputChange}
      onBuscar={() => handleBusqueda(terminoBusqueda)}
    />
      <ResultadoBusqueda agricultores={agricultores} />
    </div>
  );
};

export default InicioCooperativa;
