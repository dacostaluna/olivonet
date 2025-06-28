const axios = require("axios");

const obtenerClimaActual = async (req, res) => {
  let { direccion, coordenadas } = req.query;

  if (!direccion || direccion.toLowerCase() === "null" || direccion.toLowerCase() === "undefined") {
    direccion = null;
  }
  if (!coordenadas || coordenadas.toLowerCase() === "null" || coordenadas.toLowerCase() === "undefined") {
    coordenadas = null;
  }

  if (!direccion && !coordenadas) {
    return res.status(400).json({ error: "Debe proporcionar al menos una 'direccion' o 'coordenadas' válidas." });
  }

  try {
    let lat, lon;

    if (coordenadas) {
      const partes = coordenadas.split(",");
      if (partes.length !== 2) {
        return res.status(400).json({ error: "Formato de coordenadas inválido." });
      }
      lat = parseFloat(partes[0].trim());
      lon = parseFloat(partes[1].trim());
      if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ error: "Coordenadas no numéricas." });
      }
    } else {
      // Geocodificación con la dirección
      const geoResp = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
        params: { q: direccion, key: process.env.OPENCAGE_API_KEY },
      });

      const coords = geoResp.data.results[0]?.geometry;
      if (!coords) {
        return res.status(404).json({ error: "Dirección no encontrada." });
      }
      lat = coords.lat;
      lon = coords.lng;
    }

    // Obtener clima actual
    const weatherResp = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: {
        lat,
        lon,
        appid: process.env.OPENWEATHER_API_KEY,
        units: "metric",
        lang: "es",
      },
    });

    const clima = weatherResp.data;
    res.json({
      id: clima.weather[0].id,
      temperatura: clima.main.temp,
      temperatura_max: clima.main.temp_max,
      temperatura_min: clima.main.temp_min,
      descripcion: clima.weather[0].description,
      humedad: clima.main.humidity,
      viento: clima.wind.speed,
      lugar: clima.name,
      icono: clima.weather[0].icon,
    });
  } catch (error) {
    console.error("Error obteniendo clima:", error.message);
    res.status(500).json({ error: "Error al obtener el clima" });
  }
};

// Obtener pronóstico por día (usando params para "dias", query params para dirección o coordenadas)
const obtenerClimaPorDia = async (req, res) => {
  const { dias } = req.params;
  let { direccion, coordenadas } = req.query;

  if (!direccion || direccion.toLowerCase() === "null" || direccion.toLowerCase() === "undefined") {
    direccion = null;
  }
  if (!coordenadas || coordenadas.toLowerCase() === "null" || coordenadas.toLowerCase() === "undefined") {
    coordenadas = null;
  }

  const diasNum = Number(dias);

  if (!direccion && !coordenadas) {
    return res.status(400).json({
      error: "Debe proporcionar al menos una 'direccion' o 'coordenadas' válidas.",
    });
  }

  if (isNaN(diasNum) || diasNum < 0 || diasNum > 4) {
    return res.status(400).json({
      error: "El parámetro 'dias' debe ser un número entre 0 y 4.",
    });
  }

  const formatearFechaCorta = (fecha) => {
    const meses = [
      "ene", "feb", "mar", "abr", "may", "jun",
      "jul", "ago", "sep", "oct", "nov", "dic",
    ];
    return `${fecha.getDate()} ${meses[fecha.getMonth()]}`;
  };

  try {
    let lat, lon;

    if (coordenadas) {
      const partes = coordenadas.split(",");
      if (partes.length !== 2) {
        return res.status(400).json({ error: "Formato de coordenadas inválido." });
      }
      lat = parseFloat(partes[0].trim());
      lon = parseFloat(partes[1].trim());
      if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ error: "Coordenadas no numéricas." });
      }
    } else {
      const geoResp = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
        params: { q: direccion, key: process.env.OPENCAGE_API_KEY },
      });

      const coords = geoResp.data.results[0]?.geometry;
      if (!coords) {
        return res.status(404).json({ error: "Dirección no encontrada." });
      }
      lat = coords.lat;
      lon = coords.lng;
    }

    const forecastResp = await axios.get("https://api.openweathermap.org/data/2.5/forecast", {
      params: {
        lat,
        lon,
        appid: process.env.OPENWEATHER_API_KEY,
        units: "metric",
        lang: "es",
      },
    });

    const lista = forecastResp.data.list;
    const ciudad = forecastResp.data.city.name;

    const ahora = new Date();
    const diaObjetivo = new Date(ahora);
    diaObjetivo.setDate(ahora.getDate() + diasNum);
    diaObjetivo.setHours(0, 0, 0, 0);

    let pronosticosDia;
    if (diasNum === 0) {
      const finDia = new Date(diaObjetivo);
      finDia.setHours(23, 59, 59, 999);
      pronosticosDia = lista.filter(item => {
        const fechaItem = new Date(item.dt * 1000);
        return fechaItem >= ahora && fechaItem <= finDia;
      });
    } else {
      const finDia = new Date(diaObjetivo);
      finDia.setHours(23, 59, 59, 999);
      pronosticosDia = lista.filter(item => {
        const fechaItem = new Date(item.dt * 1000);
        return fechaItem >= diaObjetivo && fechaItem <= finDia;
      });
    }

    if (pronosticosDia.length === 0) {
      return res.status(404).json({ error: "No hay datos para ese día." });
    }

    const temps = pronosticosDia.map(p => p.main.temp);
    const tempMax = Math.max(...temps);
    const tempMin = Math.min(...temps);

    const idFrecuente = pronosticosDia.reduce((acc, p) => {
      const id = p.weather[0].id;
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});
    const idMasComun = Object.entries(idFrecuente).sort((a, b) => b[1] - a[1])[0][0];

    const descripcionFrecuente = pronosticosDia.reduce((acc, p) => {
      const desc = p.weather[0].description;
      acc[desc] = (acc[desc] || 0) + 1;
      return acc;
    }, {});
    const descripcionMasComun = Object.entries(descripcionFrecuente).sort((a, b) => b[1] - a[1])[0][0];

    const iconoFrecuente = pronosticosDia.reduce((acc, p) => {
      const icon = p.weather[0].icon;
      acc[icon] = (acc[icon] || 0) + 1;
      return acc;
    }, {});
    const iconoMasComun = Object.entries(iconoFrecuente).sort((a, b) => b[1] - a[1])[0][0];

    const humedadMedia = pronosticosDia.reduce((sum, p) => sum + p.main.humidity, 0) / pronosticosDia.length;
    const vientoMedio = pronosticosDia.reduce((sum, p) => sum + p.wind.speed, 0) / pronosticosDia.length;

    res.json({
      lugar: ciudad,
      dia: diaObjetivo.toISOString().split("T")[0],
      fecha: formatearFechaCorta(diaObjetivo),
      id: Number(idMasComun),
      temperatura: Number(pronosticosDia[0].main.temp.toFixed(1)),
      temperatura_max: Number(tempMax.toFixed(1)),
      temperatura_min: Number(tempMin.toFixed(1)),
      descripcion: descripcionMasComun,
      icono: iconoMasComun,
      humedad: Number(humedadMedia.toFixed(1)),
      viento: Number(vientoMedio.toFixed(1)),
    });
  } catch (error) {
    console.error("Error obteniendo pronóstico:", error.message);
    res.status(500).json({ error: "Error al obtener el pronóstico" });
  }
};

module.exports = { obtenerClimaActual, obtenerClimaPorDia };
