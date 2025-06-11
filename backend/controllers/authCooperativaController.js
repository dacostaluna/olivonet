const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Registrar cooperativa
const registerCooperativa = async (req, res) => {
  try {
    const { nombre, correo, password, direccion, nif } = req.body;

    const existingCoop = await prisma.cooperativa.findUnique({ where: { correo } });
    if (existingCoop) {
      return res.status(400).json({ message: "La cooperativa ya existe" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.cooperativa.create({
      data: {
        nombre,
        correo,
        password: hashedPassword,
        direccion,
        nif,
      },
    });

    res.status(201).json({ message: "Cooperativa registrada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar cooperativa" });
  }
};

// Login cooperativa
const loginCooperativa = async (req, res) => {
  try {
    const { correo, password } = req.body;

    const coop = await prisma.cooperativa.findUnique({ where: { correo } });
    if (!coop) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const isPasswordValid = await bcrypt.compare(password, coop.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: coop.id, tipo: "cooperativa" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al hacer login" });
  }
};

module.exports = {
  registerCooperativa,
  loginCooperativa,
};
