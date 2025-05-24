const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Registrar usuario
const registerUser = async (req, res) => {
  try {
    const { nombre, apellidos, correo, dni, username, fechaNacimiento, password } = req.body;

    const existingUser = await prisma.agricultor.findUnique({ where: { correo } });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }
    const existingUsername = await prisma.agricultor.findUnique({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: "El nombre de usuario ya existe" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.agricultor.create({
      data: {
        nombre,
        apellidos,
        correo,
        dni,
        username,
        fechaNacimiento: new Date(fechaNacimiento),
        password: hashedPassword
      },
    });

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

// Login usuario
const loginUser = async (req, res) => {
  try {
    const { correo, password } = req.body;

    const user = await prisma.agricultor.findUnique({ where: { correo } });
    if (!user) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al hacer login" });
  }
};

module.exports = {
  registerUser,
  loginUser
};
