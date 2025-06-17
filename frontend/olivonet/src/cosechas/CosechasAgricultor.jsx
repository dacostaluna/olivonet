// CosechasAgricultor.jsx
/*
TODO
----------------
IMPORTANTE:
Restringir en el controlador del back que solo podamos acceder a las ids de los agricultores asociados a la cooperativa actual.
----------------
*/

import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const CosechasAgricultor = () => {
  const location = useLocation();
  const agricultor = location.state?.agricultor;

  const [cosechas, setCosechas] = useState([]);

  useEffect(() => {
    if (!agricultor) return;

    const fetchCosechas = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/cosechas/${agricultor.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setCosechas(data);
        } else {
          console.error("Error al cargar las cosechas");
        }
      } catch (err) {
        console.error("Error de red:", err);
      }
    };

    fetchCosechas();
  }, [agricultor]);

  if (!agricultor) {
    return <p>No se encontró información del agricultor.</p>;
  }

  return (
    <div>
      <h2>Cosechas de {agricultor.nombre} {agricultor.apellidos}</h2>
      {cosechas.length === 0 ? (
        <p>No hay cosechas registradas.</p>
      ) : (
        <ul>
          {cosechas.map((cosecha) => (
            <li key={cosecha.id}>
              {cosecha.nombre} - {cosecha.fecha} - {cosecha.cantidad} kg
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CosechasAgricultor;
