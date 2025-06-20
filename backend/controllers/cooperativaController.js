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


const obtenerAgricultores = async (req, res) => {
  try {
    const idCooperativa = req.cooperativaId;

    const agricultores = await prisma.agricultor.findMany({
      where: { cooperativaId: idCooperativa },
    });

    res.json(agricultores);
  } catch (error) {
    console.error("Error obteniendo agricultores:", error);
    res.status(500).json({ message: "Error al obtener los agricultores" });
  }
};


const buscarAgricultor = async (req, res) => {
  try {
    const idCooperativa = req.cooperativaId;
    const termino = req.params.termino;

    const agricultor = await prisma.agricultor.findFirst({
      where: {
        cooperativaId: idCooperativa,
        OR: [
          { correo: termino },
          { dni: termino }
        ]
      }
    });

    if (!agricultor) {
      return res.status(404).json({ message: "Agricultor no encontrado" });
    }

    res.status(200).json(agricultor);
  } catch (error) {
    console.error("Error al buscar agricultor:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};



const asociarAgricultor = async (req, res) => {
  try {
    const idCooperativa = req.cooperativaId;
    const { termino } = req.body; // puede ser correo o dni

    if (!termino) {
      return res.status(400).json({ message: "Debes proporcionar un correo o un DNI del agricultor" });
    }

    // Buscar agricultor por correo o dni
    const agricultor = await prisma.agricultor.findFirst({
      where: {
        OR: [
          { correo: termino },
          { dni: termino }
        ]
      }
    });

    if (!agricultor) {
      return res.status(404).json({ message: "Agricultor no encontrado" });
    }

    // Verificar si ya está asociado
    if (agricultor.cooperativaId) {
      return res.status(400).json({ message: "Este agricultor ya está asociado a una cooperativa" });
    }

    // Asociar agricultor a la cooperativa actual
    const agricultorActualizado = await prisma.agricultor.update({
      where: { id: agricultor.id },
      data: { cooperativaId: idCooperativa }
    });

    res.status(200).json({ message: "Agricultor asociado correctamente", agricultor: agricultorActualizado });

  } catch (error) {
    console.error("Error al asociar agricultor:", error);
    res.status(500).json({ message: "Error interno al asociar agricultor" });
  }
};

const desasociarAgricultor = async (req, res) => {
  const agricultorId = parseInt(req.params.id);

  try {
    const agricultor = await prisma.agricultor.findUnique({
      where: { id: agricultorId }
    });

    if (!agricultor) {
      return res.status(404).json({ message: "Agricultor no encontrado" });
    }

    // Desasociar
    await prisma.agricultor.update({
      where: { id: agricultorId },
      data: { cooperativaId: null }
    });

    res.status(200).json({ message: "Agricultor desasociado correctamente" });
  } catch (error) {
    console.error("Error al desasociar agricultor:", error);
    res.status(500).json({ message: "Error al desasociar agricultor" });
  }
};

const obtenerCosechas = async (req, res) => {
  const cooperativaId = req.cooperativaId;
  const idAgricultor = parseInt(req.params.idAgricultor);
  let temporada = req.query.temporada;

  try {
    // Verificar si el agricultor pertenece a esta cooperativa
    const agricultor = await prisma.agricultor.findUnique({
      where: { id: idAgricultor },
      select: { cooperativaId: true }
    });

    if (!agricultor || agricultor.cooperativaId !== cooperativaId) {
      return res.status(403).json({ message: "Agricultor no encontrado" });
    }

    // Si no se ha especificado la temporada, buscar la más reciente con cosecha
    if (!temporada) {
      const ultimaCosecha = await prisma.cosecha.findFirst({
        where: { idAgricultor },
        orderBy: { temporada: 'desc' },
        select: { temporada: true }
      });

      // Si no hay cosechas registradas
      if (!ultimaCosecha) {
        return res.status(200).json([]);
      }

      temporada = ultimaCosecha.temporada;
    }

    // Buscar cosechas del agricultor para esa temporada
    const cosechas = await prisma.cosecha.findMany({
      where: {
        idAgricultor,
        temporada: parseInt(temporada)
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(cosechas);
  } catch (error) {
    console.error("Error obteniendo cosechas:", error);
    res.status(500).json({ message: "Error al obtener las cosechas." });
  }
};

const crearCosecha = async (req, res) => {
  const cooperativaId = req.cooperativaId;
  const {
    idAgricultor,
    idPropiedad,
    fecha,
    kg,
    rendimiento,
    numOlivos,
    temporada
  } = req.body;

  // Validar que idAgricultor y temporada existan
  if (!idAgricultor || !temporada || !fecha || !kg || !numOlivos) {
    return res.status(400).json({ message: "Faltan campos obligatorios." });
  }

  try {
    // 1. Verificar que el agricultor existe y pertenece a la cooperativa
    const agricultor = await prisma.agricultor.findUnique({
      where: { id: idAgricultor },
      select: { cooperativaId: true }
    });

    if (!agricultor || agricultor.cooperativaId !== cooperativaId) {
      return res.status(403).json({ message: "No tienes acceso a este agricultor." });
    }

    // 2. (Opcional) Verificar que la propiedad pertenece al agricultor
    if (idPropiedad) {
      const propiedad = await prisma.propiedad.findUnique({
        where: { id: idPropiedad },
        select: { idPropietario: true }
      });

      if (!propiedad || propiedad.idPropietario !== idAgricultor) {
        return res.status(400).json({ message: "La propiedad no pertenece al agricultor." });
      }
    }

    // 3. Crear la cosecha
    const nuevaCosecha = await prisma.cosecha.create({
      data: {
        idAgricultor,
        idPropiedad: idPropiedad || null,
        fecha: new Date(fecha),
        kg: parseFloat(req.body.kg),
        rendimiento: req.body.rendimiento ? parseFloat(req.body.rendimiento) : null,
        numOlivos,
        temporada
      }
    });

    res.status(201).json(nuevaCosecha);

  } catch (error) {
    console.error("Error creando cosecha:", error);
    res.status(500).json({ message: "Error al crear la cosecha." });
  }
};


const eliminarCosecha = async (req, res) => {
  const cooperativaId = req.cooperativaId;
  const cosechaId = parseInt(req.params.idCosecha);

  try {
    // Buscar la cosecha y obtener su agricultor
    const cosecha = await prisma.cosecha.findUnique({
      where: { id: cosechaId },
      select: {
        id: true,
        idAgricultor: true,
        agricultor: {
          select: { cooperativaId: true }
        }
      }
    });

    if (!cosecha) {
      return res.status(404).json({ message: "Cosecha no encontrada." });
    }

    // Verificar que la cosecha pertenece a un agricultor de la cooperativa actual
    if (cosecha.agricultor.cooperativaId !== cooperativaId) {
      return res.status(403).json({ message: "No tienes permiso para eliminar esta cosecha." });
    }

    // Eliminar la cosecha
    await prisma.cosecha.delete({
      where: { id: cosechaId }
    });

    res.status(200).json({ message: "Cosecha eliminada correctamente." });
  } catch (error) {
    console.error("Error eliminando cosecha:", error);
    res.status(500).json({ message: "Error al eliminar la cosecha." });
  }
};

const obtenerPropiedades = async (req, res) => {
  const cooperativaId = req.cooperativaId;
  const agricultorId = parseInt(req.params.idAgricultor);

  try {
    // Verificar que el agricultor pertenece a esta cooperativa
    const agricultor = await prisma.agricultor.findUnique({
      where: { id: agricultorId },
      select: { cooperativaId: true }
    });

    if (!agricultor || agricultor.cooperativaId !== cooperativaId) {
      return res.status(403).json({ message: "No tienes acceso a este agricultor." });
    }

    // Obtener propiedades del agricultor
    const propiedades = await prisma.propiedad.findMany({
      where: {
        idPropietario: agricultorId
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(propiedades);
  } catch (error) {
    console.error("Error obteniendo propiedades:", error);
    res.status(500).json({ message: "Error al obtener las propiedades." });
  }
};




module.exports = {
  obtenerPerfilCooperativa,
  actualizarCooperativa,
  subirFotoPerfil,
  borrarCooperativa,
  obtenerAgricultores,
  buscarAgricultor,
  asociarAgricultor,
  desasociarAgricultor,
  obtenerCosechas,
  crearCosecha,
  eliminarCosecha,
  obtenerPropiedades
};
