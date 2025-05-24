const express = require('express');
const router = express.Router();

const { borrarUsuario, obtenerUsuario, actualizarPerfil } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

//router.get('/usuarios', obtenerUsuarios);

router.get('/mi-perfil', obtenerUsuario);

router.delete('/eliminar-mi-cuenta', borrarUsuario);

router.put('/actualizarUsuario', authMiddleware, actualizarPerfil);


module.exports = router;
