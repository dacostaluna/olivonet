require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const authCooperativaRoutes = require('./routes/authCooperativaRoutes');
app.use('/api/auth/cooperativa', authCooperativaRoutes);

const cooperativaRoutes = require('./routes/cooperativaRoutes');
app.use('/cooperativa', cooperativaRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/', userRoutes);

app.use("/api/clima", require("./routes/climaRoutes"));

app.use("/api/aceite", require("./routes/aceiteRoutes"));

app.use("/chat", require("./routes/iaRoutes"));


// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
