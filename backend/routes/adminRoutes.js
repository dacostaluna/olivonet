const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getAdminInfo,
  obtenerAgricultores,
  obtenerAgricultorPorId,
  crearAgricultor,
  actualizarAgricultor,
  eliminarAgricultor
} = require('../controllers/adminController');
const verifyAdminToken = require('../middlewares/verifyAdminToken');

const soloAdmin = (req, res, next) => {
  if (req.tipo !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: solo administradores' });
  }
  next();
};

router.get('/agricultores', verifyAdminToken, soloAdmin, obtenerAgricultores);
router.get('/agricultores/:id', verifyAdminToken, soloAdmin, obtenerAgricultorPorId);
router.post('/agricultores', verifyAdminToken, soloAdmin, crearAgricultor);
router.put('/agricultores/:id', verifyAdminToken, soloAdmin, actualizarAgricultor);
router.delete('/agricultores/:id', verifyAdminToken, soloAdmin, eliminarAgricultor);

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/me', verifyAdminToken, getAdminInfo);

module.exports = router;
