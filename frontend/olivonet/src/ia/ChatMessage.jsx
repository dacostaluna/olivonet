import React from 'react';
import './ChatbotIA.css';

function ChatMessage({ rol, contenido, nombre, fotoUrl }) {
  const isAgricultor = rol === 'AGRICULTOR';

  return (
    <div className={`chat-message ${isAgricultor ? 'right' : 'left'}`}>
      <img src={fotoUrl} alt={`${nombre} avatar`} className="chat-avatar" />
      <div className={`chat-bubble ${isAgricultor ? 'bubble-agricultor' : 'bubble-ia'}`}>
        <div className="chat-nombre">{nombre}</div>
        <div className="chat-text">{contenido}</div>
      </div>
    </div>
  );
}

export default ChatMessage;
