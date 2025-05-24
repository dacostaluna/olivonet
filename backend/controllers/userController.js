const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const validarCorreo = (correo) => {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(correo);
};

/* Controlador reservado para administrador
const obtenerUsuarios = async (req, res) => {
  try {
    const users = await prisma.agricultor.findMany({
      select: {
        nombre: true,
        correo: true,
        id: true,
        password: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

*/

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
  const userId = req.userId;
  const { nombre, apellidos, username, password, fechaNacimiento, correo } = req.body;

  try {
    const user = await prisma.agricultor.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

    // Validar y comprobar email si se quiere cambiar
    if (correo) {
      if (!validarCorreo(correo)) {
        return res.status(400).json({ message: 'Formato de email inválido.' });
      }

      const correoExistente = await prisma.agricultor.findUnique({ where: { correo } });
      if (correoExistente && correoExistente.id !== userId) {
        return res.status(400).json({ message: 'Este email ya está en uso.' });
      }
    }

    // Verificar si username ya está en uso
    if (username) {
      const usuarioExistente = await prisma.agricultor.findUnique({ where: { username } });
      if (usuarioExistente && usuarioExistente.id !== userId) {
        return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
      }
    }

    // Preparamos los datos a actualizar
    const datosActualizados = {};
    if (nombre) datosActualizados.nombre = nombre;
    if (apellidos) datosActualizados.apellidos = apellidos;
    if (username) datosActualizados.username = username;
    if (fechaNacimiento) datosActualizados.fechaNacimiento = new Date(fechaNacimiento);
    if (correo) datosActualizados.correo = correo;

    // Si quiere cambiar contraseña, que no sea igual que la actual
    if (password) {
      const esIgual = await bcrypt.compare(password, user.password);
      if (esIgual) {
        return res.status(400).json({ message: 'La nueva contraseña no puede ser igual a la anterior.' });
      }

      const hashed = await bcrypt.hash(password, 10);
      updatedData.password = hashed;
    }

    const usuarioActualizado = await prisma.agricultor.update({
      where: { id: userId },
      data: datosActualizados
    });

    const { password: _, ...safeUser } = usuarioActualizado; // Sacamos la contraseña de la respuesta al cliente y guardamos los datos en safeUser
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




module.exports = {
  //obtenerUsuarios,
  obtenerUsuario,
  borrarUsuario,
  actualizarPerfil
};
