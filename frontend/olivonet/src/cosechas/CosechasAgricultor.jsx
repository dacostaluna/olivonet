import { useLocation } from "react-router-dom";
import CuadroCosechas from "./CuadroCosechas";
import "./CosechasAgricultor.css";
import InfoAgricultorCosechas from "./InfoAgricultorCosechas";
import ModalAgregarCosecha from "./ModalAgregarCosecha";
import { useState } from "react";

const CosechasAgricultor = () => {
  const location = useLocation();
  const agricultor = location.state?.agricultor;

  if (!agricultor) {
    return (
      <p className="info-no-agricultor-cosechas">
        No se encontró información del agricultor.
      </p>
    );
  }

  const [modalVisible, setModalVisible] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  const handleNuevaCosecha = () => {
    setRefreshCount((c) => c + 1);
  };

  return (
    <div className="cosechas-agricultor-principal-coop">
      <div>
        <InfoAgricultorCosechas agricultor={agricultor} />

        <h2 className="titulo-cosechas-agricultor-coop">
          Cosechas de {agricultor.nombre} {agricultor.apellidos}
        </h2>
        <CuadroCosechas
          urlBase={`http://localhost:5000/cooperativa/obtenerCosechas/${agricultor.id}`}
          urlPropiedades={`http://localhost:5000/cooperativa/obtenerPropiedades/${agricultor.id}`}
          usuario="coop"
          refresh={refreshCount}
          tipoUsuario="coop"
        />
        <button
          className="boton-flotante-asociar btn-flotante-cosechas"
          onClick={() => setModalVisible(true)}
        >
          +
        </button>

        <ModalAgregarCosecha
          agricultorId={agricultor.id}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={handleNuevaCosecha}
        />
      </div>
    </div>
  );
};

export default CosechasAgricultor;
