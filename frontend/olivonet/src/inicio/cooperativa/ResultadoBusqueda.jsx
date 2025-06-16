import './ResultadoBusqueda.css';
import CuadroAgricultor from './CuadroAgricultor';

const ResultadoBusqueda = ({ agricultores }) => {
  return (
    <div className="resultado-busqueda">
      {agricultores.length === 0 ? (
        <p>No hay agricultores para mostrar.</p>
      ) : (
        agricultores.map((agri) => (
          <CuadroAgricultor key={agri.id} agricultor={agri} />
        ))
      )}
    </div>
  );
};

export default ResultadoBusqueda;
