import { useLocation } from "react-router-dom";
import CuadroCosechas from "./CuadroCosechas";

const CosechasAgricultor = () => {
  const location = useLocation();
  const agricultor = location.state?.agricultor;

  if (!agricultor) {
    return <p>No se encontró información del agricultor.</p>;
  }

  return (
    <div>
      <h2>
        Cosechas de {agricultor.nombre} {agricultor.apellidos}
      </h2>
      <CuadroCosechas
        urlBase={`http://localhost:5000/cooperativa/obtenerCosechas/${agricultor.id}`}
        urlPropiedades={`http://localhost:5000/cooperativa/obtenerPropiedades/${agricultor.id}`}
        usuario="coop"
      />
    </div>
  );
};

export default CosechasAgricultor;
