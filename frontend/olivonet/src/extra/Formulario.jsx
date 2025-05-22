import React from 'react';
import './Formulario.css';

const Formulario = ({ texto, placeholder = '', type = 'text', value, onChange }) => {
  const id = texto.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="formulario">
      <label htmlFor={id}>{texto}</label>
      <input
        type={type}
        id={id}
        className={`form-control${type === 'date' ? ' date-picker' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Formulario;
