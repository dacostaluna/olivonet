const express = require('express');
const router = express.Router();

const { borrarUsuario, obtenerUsuario, actualizarPerfil, subirFotoPerfil, obtenerPropiedades, crearPropiedad, borrarPropiedad, actualizarPropiedad, obtenerPropiedadPorId} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multer');


//router.use(authMiddleware);

router.get('/mi-perfil', authMiddleware, obtenerUsuario);

router.delete('/eliminar-mi-cuenta', authMiddleware, borrarUsuario);

router.put('/actualizarUsuario', authMiddleware, actualizarPerfil);

router.post('/subir-foto-perfil', authMiddleware, upload.single("foto"), subirFotoPerfil);

router.get('/mis-propiedades', authMiddleware, obtenerPropiedades);

router.get('/mis-propiedades/:id', authMiddleware, obtenerPropiedadPorId);

router.post('/crear-propiedad', authMiddleware, crearPropiedad);

router.delete('/eliminar-propiedad/:id', authMiddleware, borrarPropiedad);

router.put('/actualizar-propiedad/:id', authMiddleware, actualizarPropiedad);


module.exports = router;
