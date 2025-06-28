const express = require('express');
const router = express.Router();
const {
  obtenerPreciosAceite,
  obtenerPrecioPorTipo,
} = require('../controllers/aceiteController');

router.get('/precio', obtenerPreciosAceite);

router.get('/precio/:tipo', obtenerPrecioPorTipo);

module.exports = router;
