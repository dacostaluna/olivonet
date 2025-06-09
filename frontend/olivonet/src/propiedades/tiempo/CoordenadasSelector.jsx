import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import './CoordenadasSelector.css';

const CoordenadasSelector = ({ onSave }) => {
  const [posicion, setPosicion] = useState([40.4168, -3.7038]); // Madrid
  const [guardado, setGuardado] = useState(false);
  const inputRef = useRef();

  const ManejadorClick = () => {
    useMapEvents({
      click(e) {
        setPosicion([e.latlng.lat, e.latlng.lng]);
        setGuardado(false);
      },
    });
    return null;
  };

  const buscarDireccion = async () => {
    const query = inputRef.current.value;
    if (!query) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      setPosicion([parseFloat(lat), parseFloat(lon)]);
    }
  };

  const handleGuardar = () => {
    setGuardado(true);
    onSave && onSave(posicion);
  };

  return (
    <div className="mapa-contenedor">
      <input
        type="text"
        ref={inputRef}
        className="buscador-direcciones"
        placeholder="Buscar dirección..."
        onKeyDown={(e) => e.key === 'Enter' && buscarDireccion()}
      />
      <MapContainer center={posicion} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ManejadorClick />
        <Marker position={posicion} />
      </MapContainer>
      <button className="boton-guardar-mapa" onClick={handleGuardar} disabled={guardado}>
        {guardado ? "Guardado" : "Guardar"}
      </button>
    </div>
  );
};

export default CoordenadasSelector;
