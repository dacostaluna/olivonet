const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const registerAdmin = async (req, res) => {
  try {
    const { correo, username, password, nombre } = req.body;

    const existingUser = await prisma.administrador.findUnique({ where: { correo } });
    if (existingUser) return res.status(400).json({ message: 'Ya existe un administrador con ese correo' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.administrador.create({
      data: { correo, username, nombre, password: hashedPassword },
    });

    res.status(201).json({ message: 'Administrador registrado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar administrador' });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { correo, password } = req.body;
    const admin = await prisma.administrador.findUnique({ where: { correo } });

    if (!admin) return res.status(400).json({ message: 'Credenciales inválidas' });

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) return res.status(400).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign({ id: admin.id, tipo: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al hacer login' });
  }
};

const getAdminInfo = async (req, res) => {
  try {
    const adminId = req.userId;
    const admin = await prisma.administrador.findUnique({
      select: { id: true, username: true, correo: true },
      where: { id: adminId }
    });

    if (!admin) return res.status(404).json({ message: 'Administrador no encontrado' });

    res.json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener datos del administrador' });
  }
};

/* CONTROLADORES DE GESTIÓN DE USUARIOS */

const obtenerAgricultores = async (req, res) => {
  try {
    const agricultores = await prisma.agricultor.findMany({
      select: {
        id: true,
        nombre: true,
        apellidos: true,
        correo: true,
        username: true,
        dni: true,
        fechaNacimiento: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(agricultores);
  } catch (error) {
    console.error("Error al obtener agricultores:", error);
    res.status(500).json({ message: "Error al obtener los agricultores" });
  }
};

// Obtener agricultor por ID
const obtenerAgricultorPorId = async (req, res) => {
  try {
    const agricultor = await prisma.agricultor.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!agricultor) {
      return res.status(404).json({ message: 'Agricultor no encontrado' });
    }

    res.json(agricultor);
  } catch (error) {
    console.error("Error al obtener agricultor por ID:", error);
    res.status(500).json({ message: "Error al obtener el agricultor" });
  }
};

// Crear nuevo agricultor
const crearAgricultor = async (req, res) => {
  try {
    const { nombre, apellidos, correo, username, dni, fechaNacimiento, password } = req.body;

    const existing = await prisma.agricultor.findUnique({ where: { correo } });
    if (existing) {
      return res.status(400).json({ message: 'Ya existe un agricultor con ese correo' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevo = await prisma.agricultor.create({
      data: {
        nombre, apellidos, correo, username, dni, fechaNacimiento,
        password: hashedPassword
      }
    });

    res.status(201).json(nuevo);
  } catch (error) {
    console.error("Error al crear agricultor:", error);
    res.status(500).json({ message: "Error al crear el agricultor" });
  }
};

// Actualizar agricultor
const actualizarAgricultor = async (req, res) => {
  try {
    const { nombre, apellidos, correo, username, dni, fechaNacimiento } = req.body;

    const actualizado = await prisma.agricultor.update({
      where: { id: parseInt(req.params.id) },
      data: { nombre, apellidos, correo, username, dni, fechaNacimiento }
    });

    res.json(actualizado);
  } catch (error) {
    console.error("Error al actualizar agricultor:", error);
    res.status(500).json({ message: "Error al actualizar el agricultor" });
  }
};

// Eliminar agricultor
const eliminarAgricultor = async (req, res) => {
  try {
    await prisma.agricultor.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Agricultor eliminado correctamente' });
  } catch (error) {
    console.error("Error al eliminar agricultor:", error);
    res.status(500).json({ message: "Error al eliminar el agricultor" });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminInfo,
  obtenerAgricultores,
  obtenerAgricultorPorId,
  crearAgricultor,
  actualizarAgricultor,
  eliminarAgricultor
};

