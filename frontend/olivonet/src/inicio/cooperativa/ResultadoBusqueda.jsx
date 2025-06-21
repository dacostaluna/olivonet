import './ResultadoBusqueda.css';
import CuadroAgricultor from './CuadroAgricultor';
import { useState, useEffect } from 'react';

const ResultadoBusqueda = ({ agricultores }) => {
  const [listaAgricultores, setListaAgricultores] = useState(agricultores);

  useEffect(() => {
    setListaAgricultores(agricultores);
  }, [agricultores]);

  const manejarAgricultorDesasociado = (idDesasociado) => {
    setListaAgricultores(prev => prev.filter(a => a.id !== idDesasociado));
  };

  return (
    <div className="resultado-busqueda">
      {listaAgricultores.length === 0 ? (
        <p className='no-agricultores-encontrados'>No hay agricultores para mostrar.</p>
      ) : (
        listaAgricultores.map((agri) => (
          <CuadroAgricultor
            key={agri.id}
            agricultor={agri}
            onDesasociar={manejarAgricultorDesasociado}
          />
        ))
      )}
    </div>
  );
};

export default ResultadoBusqueda;
