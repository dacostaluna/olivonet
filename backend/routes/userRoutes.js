const express = require('express');
const router = express.Router();

const { borrarUsuario, obtenerUsuario, actualizarPerfil, subirFotoPerfil, obtenerPropiedades, crearPropiedad, borrarPropiedad} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multer');


router.use(authMiddleware);

router.get('/mi-perfil', obtenerUsuario);

router.delete('/eliminar-mi-cuenta', borrarUsuario);

router.put('/actualizarUsuario', actualizarPerfil);

router.post('/subir-foto-perfil', upload.single("foto"), subirFotoPerfil);

router.get('/mis-propiedades', obtenerPropiedades);

router.post('/crear-propiedad', crearPropiedad);

router.delete('/eliminar-propiedad/:id', borrarPropiedad);


module.exports = router;
