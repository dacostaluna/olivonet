const express = require('express');
const router = express.Router();

const { obtenerUsuarios, borrarUsuario, obtenerUsuario, actualizarPerfil } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/usuarios', obtenerUsuarios);

router.get('/usuarios/:id', authMiddleware, obtenerUsuario);

router.delete('/usuarios/:id', borrarUsuario);

router.put('/actualizarUsuario', authMiddleware, actualizarPerfil);


module.exports = router;
