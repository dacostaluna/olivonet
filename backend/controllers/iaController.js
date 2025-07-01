const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SYSTEM_PROMPT_PATH = path.join(__dirname, '..', 'system_prompt.txt');


const getChatHistory = async (req, res) => {
  try {
    const agricultorId = req.userId;

    const mensajes = await prisma.mensajeIA.findMany({
      where: { agricultorId },
      orderBy: { timestamp: 'asc' }
    });

    res.json(mensajes);
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    res.status(500).json({ message: 'Error obteniendo historial' });
  }
};


const postChatMessage = async (req, res) => {
  try {
    const agricultorId = req.userId;
    const { contenido } = req.body;

    if (!contenido) {
      return res.status(400).json({ message: 'El mensaje es obligatorio' });
    }

    // 1. Leer el prompt estático
    const staticPrompt = fs.readFileSync(SYSTEM_PROMPT_PATH, 'utf-8');

    // 2. Obtener datos del agricultor
    const agricultor = await prisma.agricultor.findUnique({
      where: { id: agricultorId },
      include: { propiedades: true }
    });

    const nombre = agricultor.nombre;
    const apellidos = agricultor.apellidos;
    const propiedades = agricultor.propiedades.slice(0, 10); // Máximo 10 propiedades

    // 3. Obtener clima para cada propiedad
    const propiedadesConClima = await Promise.all(
      propiedades.map(async (prop) => {
        let clima = null;

        if (prop.coordenadas) {
          try {
            const response = await axios.get(`http://localhost:5000/api/clima/pronostico/1?coordenadas=${encodeURIComponent(prop.coordenadas)}`);
            clima = response.data;
          } catch (err) {
            console.warn(`Error obteniendo clima para propiedad ${prop.nombre}:`, err.message);
          }
        }

        return {
          nombre: prop.nombre,
          superficie: prop.superficie,
          numOlivos: prop.numOlivos,
          descripcion: prop.descripcion,
          direccion: prop.direccion,
          color: prop.color,
          tieneRiego: prop.tieneRiego,
          numOlivosRiego: prop.numOlivosRiego,
          variedad: prop.variedad,
          edadOlivos: prop.edadOlivos,
          clima
        };
      })
    );

    // 4. Construir prompt dinámico
    let dynamicPrompt = `Nombre del agricultor: ${nombre} ${apellidos}\n`;
    dynamicPrompt += `Propiedades:\n`;

    propiedadesConClima.forEach((prop, index) => {
      if (!prop) return;
      dynamicPrompt += `\nPropiedad ${index + 1}:\n`;
      dynamicPrompt += `- Nombre: ${prop.nombre}\n`;
      dynamicPrompt += `- Superficie: ${prop.superficie} m²\n`;
      dynamicPrompt += `- Número de olivos: ${prop.numOlivos}\n`;
      if (prop.descripcion) dynamicPrompt += `- Descripción: ${prop.descripcion}\n`;
      dynamicPrompt += `- Dirección: ${prop.direccion}\n`;
      if (prop.color) dynamicPrompt += `- Color: ${prop.color}\n`;
      if (prop.tieneRiego !== null) dynamicPrompt += `- Tiene riego: ${prop.tieneRiego ? 'Sí' : 'No'}\n`;
      if (prop.numOlivosRiego !== null) dynamicPrompt += `- Nº de olivos con riego: ${prop.numOlivosRiego}\n`;
      if (prop.variedad) dynamicPrompt += `- Variedad: ${prop.variedad}\n`;
      if (prop.edadOlivos !== null) dynamicPrompt += `- Edad de los olivos: ${prop.edadOlivos} años\n`;

      if (prop.clima) {
        const clima = prop.clima;
        dynamicPrompt += `- Clima:\n`;
        dynamicPrompt += `  - Lugar: ${clima.lugar}\n`;
        dynamicPrompt += `  - Día: ${clima.dia}\n`;
        dynamicPrompt += `  - Temperatura: ${clima.temperatura}°C (máx: ${clima.temperatura_max}°C, mín: ${clima.temperatura_min}°C)\n`;
        dynamicPrompt += `  - Descripción: ${clima.descripcion}\n`;
        dynamicPrompt += `  - Humedad: ${clima.humedad}%\n`;
        dynamicPrompt += `  - Viento: ${clima.viento} km/h\n`;
      }
    });

    const systemPrompt = staticPrompt + '\n\n' + dynamicPrompt;

    // 5. Guardar mensaje del agricultor
    await prisma.mensajeIA.create({
      data: {
        contenido,
        rol: 'AGRICULTOR',
        agricultorId
      }
    });

    // 6. Obtener historial anterior
    const mensajesBD = await prisma.mensajeIA.findMany({
      where: { agricultorId },
      orderBy: { timestamp: 'asc' }
    });

    const messagesForGROQ = [
      { role: 'system', content: systemPrompt },
      ...mensajesBD.map(msg => ({
        role: msg.rol === 'AGRICULTOR' ? 'user' : 'assistant',
        content: msg.contenido
      }))
    ];

    // 7. Llamada a GROQ
    const response = await axios.post(GROQ_API_URL, {
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: messagesForGROQ
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      }
    });

    const respuestaIA = response.data.choices[0].message.content;

    // 8. Guardar respuesta de la IA
    await prisma.mensajeIA.create({
      data: {
        contenido: respuestaIA,
        rol: 'IA',
        agricultorId
      }
    });

    res.json({ respuesta: respuestaIA });

  } catch (error) {
    console.error('Error en postChatMessage:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error comunicándose con la IA' });
  }
};

const deleteChatHistory = async (req, res) => {
  try {
    const agricultorId = req.userId;

    await prisma.mensajeIA.deleteMany({
      where: { agricultorId }
    });

    res.json({ message: 'Historial eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando historial:', error);
    res.status(500).json({ message: 'Error eliminando historial' });
  }
};


module.exports = {
  getChatHistory,
  postChatMessage,
  deleteChatHistory
};
