const express = require("express");
const router = express.Router();

const { registerCooperativa, loginCooperativa } = require("../controllers/authCooperativaController");

router.post("/register", registerCooperativa);

router.post("/login", loginCooperativa);

module.exports = router;
