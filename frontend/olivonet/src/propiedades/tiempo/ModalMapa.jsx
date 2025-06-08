import { useState } from 'react';
import CoordenadasSelector from './CoordenadasSelector';
import './ModalMapa.css';

const ModalMapa = () => {
  const [mostrar, setMostrar] = useState(false);
  const [coordenadas, setCoordenadas] = useState(null);

  const handleGuardar = (coords) => {
    setCoordenadas(coords);
    setMostrar(false);
    console.log("Coordenadas guardadas:", coords);
  };

  return (
    <>
      <button onClick={() => setMostrar(true)}>Seleccionar ubicación</button>

      {mostrar && (
        <div className="modal-overlay-mapa">
          <div className="modal-contenido-mapa">
            <CoordenadasSelector onSave={handleGuardar} />
            <div className="modal-botones-mapa">
              <button onClick={() => setMostrar(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {coordenadas && (
        <p>
          Coordenadas seleccionadas: {coordenadas[0].toFixed(5)}, {coordenadas[1].toFixed(5)}
        </p>
      )}
    </>
  );
};

export default ModalMapa;
