const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const streamifier = require("streamifier");
const cloudinary = require("../utils/cloudinary");

const obtenerPerfilCooperativa = async (req, res) => {
  const cooperativaId = req.cooperativaId;

  try {
    const cooperativa = await prisma.cooperativa.findUnique({
      where: { id: cooperativaId },
      select: {
        id: true,
        nombre: true,
        correo: true,
        direccion: true,
        nif: true,
        fotoPerfil: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!cooperativa) {
      return res.status(404).json({ message: "Cooperativa no encontrada" });
    }

    res.json(cooperativa);
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    res.status(500).json({ message: "Error obteniendo perfil de la cooperativa" });
  }
};

const actualizarCooperativa = async (req, res) => {
  const cooperativaId = req.cooperativaId;
  const { nombre, correo, direccion, nif } = req.body;

  try {
    const actualizada = await prisma.cooperativa.update({
      where: { id: cooperativaId },
      data: {
        nombre,
        correo,
        direccion,
        nif,
      },
    });

    res.json({ message: "Perfil actualizado correctamente", cooperativa: actualizada });
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    res.status(500).json({ message: "Error actualizando perfil de la cooperativa" });
  }
};

const subirFotoPerfil = async (req, res) => {
  const cooperativaId = req.cooperativaId;

  if (!req.file) {
    return res.status(400).json({ message: "No se ha enviado ninguna imagen." });
  }

  try {
    const streamUpload = (req) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "cooperativas" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await streamUpload(req);

    await prisma.cooperativa.update({
      where: { id: cooperativaId },
      data: { fotoPerfil: result.secure_url },
    });

    res.json({ message: "Foto actualizada correctamente", fotoPerfil: result.secure_url });
  } catch (error) {
    console.error("Error subiendo foto:", error);
    res.status(500).json({ message: "Error subiendo foto de perfil." });
  }
};

const borrarCooperativa = async (req, res) => {
  const cooperativaId = req.cooperativaId;

  try {
    await prisma.cooperativa.delete({
      where: { id: cooperativaId },
    });

    res.json({ message: "Cooperativa eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar cooperativa:", error);
    res.status(500).json({ message: "Error al eliminar cooperativa" });
  }
};

module.exports = {
  obtenerPerfilCooperativa,
  actualizarCooperativa,
  subirFotoPerfil,
  borrarCooperativa,
};
