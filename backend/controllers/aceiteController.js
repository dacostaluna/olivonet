const axios = require('axios');
const cheerio = require('cheerio');

const extraerPrecioAceite = ($, tipo) => {
  const celda = $(`td:contains("${tipo}")`);
  if (celda.length === 0) return null;

  const precio = celda.nextAll('td').last().text().trim();
  return precio || null;
};

const obtenerPreciosAceite = async (req, res) => {
  try {
    const { data: html } = await axios.get('https://www.infaoliva.com/');
    const $ = cheerio.load(html);

    const precios = {
      virgen_extra: extraerPrecioAceite($, "Aceite de oliva virgen extra"),
      virgen: extraerPrecioAceite($, "Aceite de oliva virgen"),
      lampante: extraerPrecioAceite($, "Aceite de oliva lampante"),
    };

    res.json(precios);
  } catch (error) {
    console.error("Error al obtener los precios del aceite:", error);
    res.status(500).json({ error: "No se pudieron obtener los precios del aceite" });
  }
};

const obtenerPrecioPorTipo = async (req, res) => {
  try {
    const { tipo } = req.params;

    const tiposValidos = {
      "virgen-extra": "Aceite de oliva virgen extra",
      "virgen": "Aceite de oliva virgen",
      "lampante": "Aceite de oliva lampante",
    };

    if (!tiposValidos[tipo]) {
      return res.status(400).json({ error: "Tipo de aceite no válido" });
    }

    const { data: html } = await axios.get('https://www.infaoliva.com/');
    const $ = cheerio.load(html);

    const precio = extraerPrecioAceite($, tiposValidos[tipo]);

    if (!precio) {
      return res.status(404).json({ error: "Precio no encontrado para ese tipo de aceite" });
    }

    res.json({ tipo, precio });
  } catch (error) {
    console.error("Error al obtener el precio:", error);
    res.status(500).json({ error: "Error interno al obtener el precio" });
  }
};

module.exports = {
  obtenerPreciosAceite,
  obtenerPrecioPorTipo,
};
