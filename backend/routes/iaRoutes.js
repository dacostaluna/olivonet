const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getChatHistory, postChatMessage } = require('../controllers/iaController');

router.get('/historial-mensajes', authMiddleware, getChatHistory);
router.post('/mensaje', authMiddleware, postChatMessage);

module.exports = router;
