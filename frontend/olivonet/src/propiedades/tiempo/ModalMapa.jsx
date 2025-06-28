import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import './ModalMapa.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const CambiarCentro = ({ center }) => {
  const map = useMap();
  if (center) {
    map.setView(center, 13);
  }
  return null;
};

const MarcadorSeleccion = ({ onClickMapa, posicion }) => {
  const [posicionInterna, setPosicionInterna] = useState(posicion || null);

  useMapEvents({
    click(e) {
      setPosicionInterna(e.latlng);
      onClickMapa(e.latlng);
    },
  });

  React.useEffect(() => {
    setPosicionInterna(posicion);
  }, [posicion]);

  return posicionInterna ? <Marker position={posicionInterna} /> : null;
};

const ModalMapa = ({ onSeleccionarCoordenadas, coordenadasIniciales }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [coordenadasSeleccionadas, setCoordenadasSeleccionadas] = useState(
    coordenadasIniciales || null
  );
  const [direccion, setDireccion] = useState("");

  const abrirModal = () => setModalAbierto(true);
  const cerrarModal = () => setModalAbierto(false);

  const manejarClickMapa = (latlng) => {
    setCoordenadasSeleccionadas(latlng);
  };

  const confirmarSeleccion = () => {
    if (coordenadasSeleccionadas) {
      const latLngStr = `${coordenadasSeleccionadas.lat.toFixed(
        6
      )}, ${coordenadasSeleccionadas.lng.toFixed(6)}`;
      onSeleccionarCoordenadas(latLngStr);
      cerrarModal();
    } else {
      alert("Por favor, selecciona una ubicación en el mapa.");
    }
  };

  const buscarDireccion = async (e) => {
    e.preventDefault();
    if (!direccion.trim()) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          direccion
        )}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const nuevaPos = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setCoordenadasSeleccionadas(nuevaPos);
      } else {
        alert("No se encontraron resultados para esa dirección.");
      }
    } catch (error) {
      alert("Error al buscar la dirección.");
      console.error(error);
    }
  };

  return (
    <>
      <button onClick={abrirModal} className="btn-abrir-mapa">
        Seleccionar coordenadas
      </button>

      {modalAbierto && (
        <div className="modal-overlay-mapa">
          <div className="modal-contenido-mapa">
            <h2>Selecciona las coordenadas en el mapa</h2>

            <form onSubmit={buscarDireccion}>
              <input
                type="text"
                placeholder="Buscar dirección..."
                className="buscador-direcciones-modal"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                autoComplete="off"
              />
            </form>

            <MapContainer
              center={
                coordenadasSeleccionadas
                  ? [coordenadasSeleccionadas.lat, coordenadasSeleccionadas.lng]
                  : [37.7749, -3.789]
              }
              zoom={13}
              style={{ height: "350px", width: "100%", marginTop: "10px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              />
              <MarcadorSeleccion
                onClickMapa={manejarClickMapa}
                posicion={coordenadasSeleccionadas}
              />
              <CambiarCentro center={coordenadasSeleccionadas} />
            </MapContainer>

            <div className="modal-botones-mapa">
              <button onClick={confirmarSeleccion} className="btn-confirmar">
                Confirmar
              </button>
              <button
                onClick={cerrarModal}
                className="btn-cancelar"
                style={{ marginLeft: "10px" }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalMapa;
