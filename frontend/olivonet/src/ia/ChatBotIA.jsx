import React, { useEffect, useState, useRef } from 'react';
import ChatMessage from './ChatMessage';
import './ChatbotIA.css';
import fotoDefault from '../assets/default_perfil.jpg';
import iaImagen from '../assets/ia-imagen.jpg';

const LOADING_ANIMATION_URL = 'https://assets10.lottiefiles.com/packages/lf20_usmfx6bp.json';

const API_BASE = 'http://localhost:5000/chat';
const PERFIL_API = 'http://localhost:5000/mi-perfil';

function ChatbotIA() {
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [agricultorPerfil, setAgricultorPerfil] = useState({ nombre: '', fotoUrl: '' });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchPerfil();
    fetchMessages();
  }, []);

  const fetchPerfil = async () => {
    try {
      const res = await fetch(PERFIL_API, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Error cargando perfil');
      const perfil = await res.json();

      setAgricultorPerfil({
        nombre: perfil.nombre,
        fotoUrl: perfil.fotoPerfil ? perfil.fotoPerfil : fotoDefault,
      });
    } catch (err) {
      console.error(err);
      setAgricultorPerfil({
        nombre: 'Agricultor',
        fotoUrl: fotoDefault
      });
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/historial-mensajes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      if (!res.ok) throw new Error('Error cargando mensajes');
      const data = await res.json();
      setMessages(data);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    try {
      setLoading(true);

      setMessages(prev => [
        ...prev,
        { id: Date.now(), contenido: inputMsg, rol: 'AGRICULTOR' }
      ]);
      scrollToBottom();

      const res = await fetch(`${API_BASE}/mensaje`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ contenido: inputMsg }),
      });

      if (!res.ok) throw new Error('Error enviando mensaje');
      const responseData = await res.json();

      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, contenido: responseData.respuesta, rol: 'IA' }
      ]);
      setInputMsg('');
      scrollToBottom();

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">Chat con IA</div>

      <div className="chatbot-messages">
        {messages.map(msg => (
          <ChatMessage
            key={msg.id}
            rol={msg.rol}
            contenido={msg.contenido}
            nombre={msg.rol === 'IA' ? 'IA' : agricultorPerfil.nombre}
            fotoUrl={msg.rol === 'IA'
              ? iaImagen
              : agricultorPerfil.fotoUrl
            }
          />
        ))}

        {loading && (
          <ChatMessage
            rol="IA"
            contenido={
              <div className="loading-animation">
                <img src={LOADING_ANIMATION_URL} alt="Cargando..." style={{ width: 50, height: 50 }} />
              </div>
            }
            nombre="OliBot"
            fotoUrl={iaImagen}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chatbot-form" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={inputMsg}
          onChange={e => setInputMsg(e.target.value)}
          className="chatbot-input"
          disabled={loading}
        />
        <button type="submit" className="chatbot-send-btn" disabled={loading}>Enviar</button>
      </form>
    </div>
  );
}

export default ChatbotIA;
