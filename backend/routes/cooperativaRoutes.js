const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const {
  obtenerPerfilCooperativa,
  actualizarCooperativa,
  subirFotoPerfil,
  borrarCooperativa,
} = require("../controllers/cooperativaController");

const authMiddlewareCooperativa = require("../middlewares/authMiddlewareCooperativa");

router.get("/perfil", authMiddlewareCooperativa, obtenerPerfilCooperativa);
router.put("/perfil", authMiddlewareCooperativa, actualizarCooperativa);
router.post("/foto", authMiddlewareCooperativa, upload.single("foto"), subirFotoPerfil);
router.delete("/borrarCooperativa", authMiddlewareCooperativa, borrarCooperativa);

module.exports = router;
