const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const {
  obtenerPerfilCooperativa,
  actualizarCooperativa,
  subirFotoPerfil,
  borrarCooperativa,
  obtenerAgricultores,
  buscarAgricultor,
  asociarAgricultor,
  desasociarAgricultor,
  obtenerCosechas,
  crearCosecha,
  eliminarCosecha,
  obtenerPropiedades
} = require("../controllers/cooperativaController");

const authMiddlewareCooperativa = require("../middlewares/authMiddlewareCooperativa");

router.get("/perfil", authMiddlewareCooperativa, obtenerPerfilCooperativa);
router.put("/perfil", authMiddlewareCooperativa, actualizarCooperativa);
router.post("/foto", authMiddlewareCooperativa, upload.single("foto"), subirFotoPerfil);
router.delete("/borrarCooperativa", authMiddlewareCooperativa, borrarCooperativa);

router.get("/obtenerAgricultores", authMiddlewareCooperativa, obtenerAgricultores);
router.get("/buscarAgricultor/:termino", authMiddlewareCooperativa, buscarAgricultor);
router.post("/asociarAgricultor", authMiddlewareCooperativa, asociarAgricultor);
router.put('/desasociar/:id', authMiddlewareCooperativa, desasociarAgricultor);

router.get('/obtenerCosechas/:idAgricultor', authMiddlewareCooperativa, obtenerCosechas);
router.post('/crearCosecha', authMiddlewareCooperativa, crearCosecha);
router.delete('/borrarCosecha/:idCosecha', authMiddlewareCooperativa, eliminarCosecha);

router.get('/obtenerPropiedades/:idAgricultor', authMiddlewareCooperativa, obtenerPropiedades);


module.exports = router;
