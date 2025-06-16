import React from 'react';
import './CuadroBusqueda.css';
import lupaIcono from '../../assets/lupa.png';

const CuadroBusqueda = ({ valor, onChange, onBuscar }) => {
  const manejarEnter = (e) => {
    if (e.key === 'Enter') {
      onBuscar();
    }
  };

  return (
    <div className="cuadro-busqueda">
      <img src={lupaIcono} alt="Buscar" className="icono-lupa" />
      <input
        type="text"
        placeholder="Buscar correo/DNI de usuario registrado"
        value={valor}
        onChange={e => onChange(e.target.value)}
        onKeyDown={manejarEnter}
        className="input-busqueda"
      />
    </div>
  );
};

export default CuadroBusqueda;
