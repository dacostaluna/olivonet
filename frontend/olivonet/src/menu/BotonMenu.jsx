import React from 'react';
import './BotonMenu.css';

const BotonMenu = ({ texto, icono, onClick, activo}) => {
  return (
    <button
      className={`boton-menu ${activo ? 'activo' : ''}`} /* Cuando */
      onClick={onClick}
      >
      {icono && <img src={icono} alt="" className="icono-boton" />}
      <strong className="texto-boton">
        {texto}
      </strong>
    </button>
  );
};

export default BotonMenu;

