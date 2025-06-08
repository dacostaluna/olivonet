import React, { useEffect, useState } from "react";
import "./Tiempo.css";

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

const Tiempo = ({ direccion, ruta, dia }) => {
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

    fetch(`${BASE_URL}${ruta}/${encodeURIComponent(direccion)}`, {
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
  }, [direccion, ruta]);

  if (loading)
    return <p className="tiempo-mensaje">Cargando datos del tiempo...</p>;
  if (error || !datos || datos.temperatura === undefined)
    return (
      <p className="tiempo-mensaje">
        No se pudo obtener la información del tiempo.
      </p>
    );

  const colorTemp = getColorFromTemperature(datos.temperatura);
  const diaMostrado = dia || datos.fecha;

  return (
    <div className="tiempo-contenedor">
      <div
        className="tiempo-icono-contenedor"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <img
          src={`https://openweathermap.org/img/wn/${datos.icono}@2x.png`}
          alt="Icono del tiempo"
          className="tiempo-icono"
        />
        {hover && <div className="tiempo-hover-texto">{datos.descripcion}</div>}
      </div>
      <div className="tiempo-detalles">
        <div className="temperatura-max">{Math.round(datos.temperatura_max)}º</div>
        <div className="temperatura-min">{Math.round(datos.temperatura_min)}º</div>
      </div>
      <div className="tiempo-dia">{diaMostrado}</div>
      
      
    </div>
  );
};

export default Tiempo;
