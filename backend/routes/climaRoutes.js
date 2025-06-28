const express = require("express");
const router = express.Router();
const { obtenerClimaActual, obtenerClimaPorDia } = require("../controllers/climaController");

router.get("/actual", obtenerClimaActual);

router.get("/pronostico/:dias", obtenerClimaPorDia);

module.exports = router;
