import React, { useEffect, useState } from "react";
import "./TiempoActual.css";

import { WiHumidity, WiStrongWind } from "react-icons/wi";
import Espacio from "../../extra/Espacio";

const BASE_URL = "http://localhost:5000/api/clima";

const getColorFromTemperature = (temp) => {
  if (temp === null || temp === undefined) return "#000";
  const clamped = Math.max(0, Math.min(45, temp));
  const percent = clamped / 45;

  if (percent < 0.2) return "#2b2bff";
  if (percent < 0.35) return "#0080ff";
  if (percent < 0.5) return "#00cc66";
  if (percent < 0.7) return "#ffcc00";
  if (percent < 0.85) return "#ff6600";
  return "#cc0000";
};

const TiempoActual = ({ direccion, coordenadas, ruta, dia }) => {
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
      <p className="tiempo-actual-mensaje">Cargando datos meteorológicos...</p>
    );
  if (error || !datos || datos.temperatura === undefined)
    return (
      <div className="tiempo-actual-mensaje">
        No se pudo obtener la información meteorológica. Por favor, asegúrese de que esta propiedad tiene unas coordenadas o una dirección registrada
      </div>
    );

  const colorTemp = getColorFromTemperature(datos.temperatura);

  return (
    <div className="tiempo-actual-contenedor">
      <div className="tiempo-actual-principal">
        <div className="tiempo-actual-temperatura" style={{ color: colorTemp }}>
          {Math.round(datos.temperatura)}º
        </div>
        <div
          className="tiempo-actual-icono-contenedor"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <img
            src={`https://openweathermap.org/img/wn/${datos.icono}@2x.png`}
            alt="Icono del tiempo"
            className="tiempo-actual-icono"
          />
          {hover && (
            <div className="tiempo-actual-hover-texto">{datos.descripcion}</div>
          )}
        </div>
      </div>
      <div className="tiempo-actual-dia">{dia}</div>
      <div className="tiempo-actual-detalles">
        <div>💧{datos.humedad}%</div>
        <Espacio anchura="8px"/>
        <div className="viento">
          <WiStrongWind className="icono-viento" size={24} />
          {datos.viento} m/s
        </div>
      </div>
    </div>
  );
};

export default TiempoActual;
