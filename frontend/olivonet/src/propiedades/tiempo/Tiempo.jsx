import React, { useEffect, useState } from "react";
import "./Tiempo.css";
import { FaSpinner } from 'react-icons/fa';
import { BiErrorCircle } from 'react-icons/bi'

const BASE_URL = "http://localhost:5000/api/clima";

const getColorFromTemperature = (temp) => {
  if (temp === null || temp === undefined) return "#000";
  const clamped = Math.max(0, Math.min(45, temp));
  const percent = clamped / 45;

  if (percent < 0.2) return "#2b2bff"; // azul oscuro
  if (percent < 0.35) return "#0080ff"; // azul claro
  if (percent < 0.5) return "#00cc66"; // verde
  if (percent < 0.7) return "#ffcc00"; // amarillo
  if (percent < 0.85) return "#ff6600"; // naranja
  return "#cc0000"; // rojo oscuro
};

const Tiempo = ({ direccion, coordenadas, ruta = "actual", dia }) => {
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    // Construir URL con query params según los props
    let url = `${BASE_URL}/${ruta}`;
    const params = new URLSearchParams();

    if (coordenadas) {
      params.append("coordenadas", coordenadas);
    } else if (direccion) {
      params.append("direccion", direccion);
    }

    if ([...params].length > 0) {
      url += `?${params.toString()}`;
    }

    console.log(url)

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error en la respuesta");
        return res.json();
      })
      .then((data) => {
        setDatos(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [direccion, coordenadas, ruta, dia]);

  if (loading)
    return (
        <div className="spinner-container">
            <FaSpinner className="spinner-icon" />
        </div>
    );

  if (
    error ||
    !datos ||
    (ruta === "actual" && datos.temperatura === undefined) ||
    (ruta === "pronostico" && !Array.isArray(datos))
  )
    return (
      <div style={{ textAlign: 'center', color: 'crimson' }}>
      <BiErrorCircle size={48} />
    </div>
    );

  // Si es pronóstico, asumo que datos es un array de días; aquí mostramos el primero o el día que se quiera
  const info = ruta === "pronostico" ? datos[0] || {} : datos;

  const colorTemp = getColorFromTemperature(info.temperatura || info.temperatura_max);
  const diaMostrado = dia || info.fecha || "Hoy";

  return (
    <div className="tiempo-contenedor">
      <div
        className="tiempo-icono-contenedor"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <img
          src={`https://openweathermap.org/img/wn/${info.icono}@2x.png`}
          alt="Icono del tiempo"
          className="tiempo-icono"
        />
        {hover && <div className="tiempo-hover-texto">{info.descripcion}</div>}
      </div>
      <div className="tiempo-detalles">
        <div className="temperatura-max">
          {info.temperatura_max !== undefined
            ? Math.round(info.temperatura_max) + "º"
            : info.temperatura
            ? Math.round(info.temperatura) + "º"
            : "-"}
        </div>
        <div className="temperatura-min">
          {info.temperatura_min !== undefined
            ? Math.round(info.temperatura_min) + "º"
            : "-"}
        </div>
      </div>
      <div className="tiempo-dia">
        {diaMostrado}
      </div>
    </div>
  );
};

export default Tiempo;
