const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getChatHistory, postChatMessage, deleteChatHistory } = require('../controllers/iaController');

router.get('/historial-mensajes', authMiddleware, getChatHistory);
router.post('/mensaje', authMiddleware, postChatMessage);
router.delete('/borrar-conversacion', authMiddleware, deleteChatHistory);


module.exports = router;