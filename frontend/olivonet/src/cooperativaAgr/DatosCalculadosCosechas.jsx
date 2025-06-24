import React, { useEffect, useState } from "react";
import CuadroMostrarDatos from "./CuadroMostrarDatos";
import CuadroResumenOlivos from "./CuadroResumenOlivos";

import "./DatosCalculadosCosechas.css";

const DatosCalculadosCosechas = ({ modo = "fila" }) => {
  const [datos, setDatos] = useState({
    totalKg: 0,
    rendimientoMedio: 0,
    porcentajeOlivosCosechados: 0,
    totalOlivos: 0,
    totalOlivosCosechados: 0,
  });

  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchDatos = async () => {
      try {
        // Obtener propiedades
        const resProp = await fetch("http://localhost:5000/mis-propiedades", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const propiedades = await resProp.json();

        const totalOlivos = propiedades.reduce(
          (acc, prop) => acc + prop.numOlivos,
          0
        );

        // Obtener cosechas
        const resCosechas = await fetch("http://localhost:5000/mis-cosechas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cosechas = await resCosechas.json();

        if (cosechas.length === 0) {
          setDatos({
            totalKg: 0,
            rendimientoMedio: 0,
            porcentajeOlivosCosechados: 0,
            totalOlivos: totalOlivos,
            totalOlivosCosechados: 0,
          });
          setCargando(false);
          return;
        }

        // Encontrar la última temporada
        const ultimaTemporada = Math.max(...cosechas.map((c) => c.temporada));
        const cosechasUltima = cosechas.filter(
          (c) => c.temporada === ultimaTemporada
        );

        const totalKg = cosechasUltima.reduce(
          (sum, c) => sum + parseFloat(c.kg),
          0
        );
        const totalOlivosCosechados = cosechasUltima.reduce(
          (sum, c) => sum + c.numOlivos,
          0
        );

        const rendimientos = cosechasUltima
          .map((c) => parseFloat(c.rendimiento))
          .filter((r) => !isNaN(r));
        const rendimientoMedio = rendimientos.length
          ? rendimientos.reduce((a, b) => a + b, 0) / rendimientos.length
          : 0;

        const porcentajeOlivos = totalOlivos
          ? (totalOlivosCosechados / totalOlivos) * 100
          : 0;

        setDatos({
          totalKg,
          rendimientoMedio,
          porcentajeOlivosCosechados: porcentajeOlivos,
          totalOlivos,
          totalOlivosCosechados,
        });
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchDatos();
  }, []);

  if (cargando) return <p>Cargando datos de cosechas...</p>;

  return (
    <div className={`cuadros-datos-agricultor ${modo}`}>
      <CuadroMostrarDatos
        valor={datos.totalKg}
        medida="kg"
        texto="de aceituna cosechada esta temporada"
      />
      <CuadroMostrarDatos
        valor={datos.rendimientoMedio*100}
        medida="%"
        texto="de rendimiento medio"
      />
      <CuadroMostrarDatos
        valor={datos.porcentajeOlivosCosechados}
        medida="%"
        texto="de olivos cosechados esta temporada"
      />
      <CuadroResumenOlivos
        total={datos.totalOlivos}
        cosechados={datos.totalOlivosCosechados}
      />
    </div>
  );
};

export default DatosCalculadosCosechas;
