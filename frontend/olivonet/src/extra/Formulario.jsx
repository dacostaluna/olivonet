// Formulario.jsx
import React from 'react';
import './Formulario.css';

const Formulario = ({
  texto,
  placeholder = '',
  type = 'text',
  value,
  onChange,
  width,
  height,
  esArea = false,
  opciones = [],
  disabled = false,
}) => {
  const id = texto.toLowerCase().replace(/\s+/g, '-');
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  const esCheckbox = type === 'checkbox';
  const labelClass = esCheckbox ? 'formulario-horizontal' : '';

  // Elimina placeholder si está desactivado
  const inputPlaceholder = disabled ? '' : placeholder;

  return (
    <div className={`formulario ${labelClass} ${disabled ? 'formulario-disabled' : ''}`}>
      <label htmlFor={id}>{texto}</label>

      {type === 'select' ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          style={style}
          className="form-control"
          disabled={disabled}
        >
          <option value="">Selecciona la variedad de aceituna</option>
          {opciones.map((op, i) => (
            <option key={i} value={op}>{op}</option>
          ))}
        </select>
      ) : type === 'checkbox' ? (
        <input
          type="checkbox"
          className='form-check-input'
          id={id}
          checked={value}
          onChange={onChange}
          style={style}
        />
      ) : esArea ? (
        <textarea
          id={id}
          className="form-control"
          placeholder={inputPlaceholder}
          value={value}
          onChange={onChange}
          style={style}
          rows={height ? undefined : 4}
          disabled={disabled}
        />
      ) : (
        <input
          type={type}
          id={id}
          className={`form-control${type === 'date' ? ' date-picker' : ''}`}
          placeholder={inputPlaceholder}
          value={value}
          onChange={onChange}
          style={style}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default Formulario;
