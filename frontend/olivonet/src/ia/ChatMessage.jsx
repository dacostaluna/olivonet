import React from 'react';
import './ChatbotIA.css';

function parseFormattedText(texto) {
  // Código multilínea
  texto = texto.replace(/``(.*?)``/gs, '<pre><code>$1</code></pre>');
  // Código en línea
  texto = texto.replace(/`(.*?)`/gs, '<code>$1</code>');
  // Negrita
  texto = texto.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Cursiva
  texto = texto.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Tachado
  texto = texto.replace(/~~(.*?)~~/g, '<del>$1</del>');
  // Citas
  texto = texto.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
  // Lista con guión
  texto = texto.replace(/^- (.*$)/gm, '<li>$1</li>');
  // Lista ordenada
  texto = texto.replace(/^\d+\.\s(.*$)/gm, '<li>$1</li>');
  // Nueva: Lista con asterisco al inicio
  texto = texto.replace(/^\* (.*$)/gm, '<li>$1</li>');

  // Agrupamos elementos li en un ul
  texto = texto.replace(/(<li>.*?<\/li>)+/gs, match => `<ul>${match}</ul>`);

  // Saltos de línea
  texto = texto.replace(/\n/g, '<br>');

  return texto;
}

function ChatMessage({ rol, contenido, nombre, fotoUrl, children }) {
  const isAgricultor = rol === 'AGRICULTOR';
  const isString = typeof contenido === 'string';
  const contenidoHTML = isString ? parseFormattedText(contenido) : '';

  return (
    <div className={`chat-message ${isAgricultor ? 'right' : 'left'}`}>
      <img src={fotoUrl} alt={`${nombre} avatar`} className="chat-avatar" />
      <div className={`chat-bubble ${isAgricultor ? 'bubble-agricultor' : 'bubble-ia'}`}>
        <div className="chat-nombre">{nombre}</div>
        <div className="chat-text">
          {children ? children : (
            <div dangerouslySetInnerHTML={{ __html: contenidoHTML }} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
