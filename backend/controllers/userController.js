const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');
const bcrypt = require('bcrypt');


const validarCorreo = (correo) => {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(correo);
};


const obtenerUsuario = async (req, res) => {
  try {
    const userId = req.userId;
    
    const user = await prisma.agricultor.findUnique({
      select: {
        id: true,
        apellidos: true,
        nombre: true,
        correo: true,
        username: true,
        dni: true,
        fechaNacimiento: true,
        fotoPerfil: true,
        createdAt: true
      },
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error("Error mostrando usuario:", error);
    res.status(500).json({ error: "Error mostrando usuario" });
  }
};


const actualizarPerfil = async (req, res) => {
  console.log('BODY actualizarPerfil:', req.body);
  const userId = req.userId;
  const {
    nombre,
    apellidos,
    username,
    actual,    // contraseña actual
    nueva,     // nueva contraseña
    fechaNacimiento,
    correo
  } = req.body;

  try {
    const user = await prisma.agricultor.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

    // Validaciones de correo y username...
    // (idénticas a las que ya tienes)

    // Preparamos los datos a actualizar
    const datosActualizados = {};
    if (nombre) datosActualizados.nombre = nombre;
    if (apellidos) datosActualizados.apellidos = apellidos;
    if (username) datosActualizados.username = username;
    if (fechaNacimiento) datosActualizados.fechaNacimiento = new Date(fechaNacimiento);
    if (correo) datosActualizados.correo = correo;

    // Si nos envían un cambio de contraseña:
    if (actual && nueva) {
      // 1) Comprobar que la contraseña actual coincide
      const coincide = await bcrypt.compare(actual, user.password);
      if (!coincide) {
        return res.status(400).json({ message: 'Contraseña actual incorrecta.' });
      }

      // 2) Comprobar que la nueva no sea igual a la actual
      const esIgual = await bcrypt.compare(nueva, user.password);
      if (esIgual) {
        return res.status(400).json({ message: 'La nueva contraseña no puede ser igual a la anterior.' });
      }

      // 3) Hash y asignación al objeto
      const hashed = await bcrypt.hash(nueva, 10);
      console.log('Datos a actualizar:', datosActualizados);
      datosActualizados.password = hashed;
    }

    // Si no envían ambos campos (actual + nueva), no se toca la password

    const usuarioActualizado = await prisma.agricultor.update({
      where: { id: userId },
      data: datosActualizados
    });

    const { password: _, ...safeUser } = usuarioActualizado;
    res.json(safeUser);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar el perfil.' });
  }
};



const borrarUsuario = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await prisma.agricultor.delete({
      where: {
        id: userId,
      },
    });

    res.json({ message: "Usuario eliminado correctamente", user });
  } catch (error) {
    console.error("Error eliminando usuario:", error);
    res.status(500).json({ error: "Error eliminando usuario" });
  }
};

const subirFotoPerfil = async (req, res) => {
  const userId = req.userId;

  if (!req.file) {
    return res.status(400).json({ message: "No se ha enviado ninguna imagen." });
  }

  try {
    const streamUpload = (req) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "perfiles" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await streamUpload(req);

    const user = await prisma.agricultor.update({
      where: { id: userId },
      data: { fotoPerfil: result.secure_url }
    });

    res.json({ message: "Foto actualizada correctamente", fotoPerfil: result.secure_url });
  } catch (error) {
    console.error("Error subiendo foto:", error);
    res.status(500).json({ message: "Error subiendo foto de perfil." });
  }
};


const obtenerPropiedades = async (req, res) => {
  try {
    const propiedades = await prisma.propiedad.findMany({
      where: {
        idPropietario: req.userId,
      },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        tipo: true,
        superficie: true,
        direccion: true,
        coordenadas: true,
        // (foto o descripción)
      },
    });

    res.json(propiedades);
  } catch (error) {
    console.error("Error al obtener propiedades:", error);
    res.status(500).json({ message: "Error al obtener propiedades" });
  }
};

// Dentro de userController.js

const crearPropiedad = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      tipo,
      superficie,
      coordenadas,
      direccion,
    } = req.body;

    const nuevaPropiedad = await prisma.propiedad.create({
      data: {
        nombre,
        descripcion,
        tipo,
        superficie: parseInt(superficie),
        coordenadas,
        direccion,
        idPropietario: req.userId,
      },
    });

    res.status(201).json(nuevaPropiedad);
  } catch (error) {
    console.error("Error al crear propiedad:", error);
    res.status(500).json({ message: "Error al crear propiedad" });
  }
};

const borrarPropiedad = async (req, res) => {
  const propiedadId = parseInt(req.params.id);

  try {
    const propiedad = await prisma.propiedad.findUnique({
      where: { id: propiedadId },
    });

    if (!propiedad || propiedad.idPropietario !== req.userId) {
      return res.status(403).json({ message: "No tienes permiso para borrar esta propiedad." });
    }

    await prisma.propiedad.delete({
      where: { id: propiedadId },
    });

    res.json({ message: "Propiedad eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar propiedad:", error);
    res.status(500).json({ message: "Error al eliminar propiedad" });
  }
};


module.exports = {
  obtenerUsuario,
  borrarUsuario,
  actualizarPerfil,
  subirFotoPerfil,
  obtenerPropiedades,
  crearPropiedad,
  borrarPropiedad
};
