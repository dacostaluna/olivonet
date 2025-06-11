const express = require("express");
const router = express.Router();

const { registerCooperativa, loginCooperativa } = require("../controllers/authCooperativaController");

// Ruta para registrar cooperativa
router.post("/register", registerCooperativa);

// Ruta para login cooperativa
router.post("/login", loginCooperativa);

module.exports = router;
