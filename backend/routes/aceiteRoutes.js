const express = require('express');
const router = express.Router();
const {
  obtenerPreciosAceite,
  obtenerPrecioPorTipo,
} = require('../controllers/aceiteController');

// Ruta general que devuelve todos los precios
router.get('/precio', obtenerPreciosAceite);

// Ruta específica para un tipo
router.get('/precio/:tipo', obtenerPrecioPorTipo);

module.exports = router;
