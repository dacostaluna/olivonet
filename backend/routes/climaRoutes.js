// routes/climaRoutes.js
const express = require("express");
const router = express.Router();
const { obtenerClimaActual, obtenerClimaPorDia } = require("../controllers/climaController");

router.get("/actual/:direccion", obtenerClimaActual);

router.get("/dia/:dias/:direccion", obtenerClimaPorDia);

module.exports = router;
