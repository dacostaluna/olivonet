import { FaTimes } from "react-icons/fa";
import "./TarjetaCosecha.css";

const TarjetaCosecha = ({ cosecha, usuario, actualizarCosechas }) => {
  const handleEliminar = async () => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar esta cosecha?");
    if (!confirmacion) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/cooperativa/borrarCosecha/${cosecha.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("Cosecha eliminada");
        if (actualizarCosechas) actualizarCosechas();
      } else {
        alert("Error al eliminar la cosecha");
      }
    } catch (err) {
      console.error("Error al eliminar cosecha:", err);
    }
  };

  const fecha = new Date(cosecha.fecha);
  const fechaFormateada = fecha.toLocaleDateString("es-ES");

return (
  <div className="tarjeta-cosecha">
    <div className="fecha-cosecha"><strong>{fechaFormateada}</strong></div>

    {usuario === "coop" && (
      <button className="boton-agricultor eliminar btn-eliminar-cosecha" onClick={handleEliminar} title="Eliminar">
        <FaTimes />
      </button>
    )}

    <div className="contenido-cosecha">
      <div className="columna-cosecha">
        <p><strong>{cosecha.kg} </strong>  kg recogidos</p>
        <p><strong>{(cosecha.rendimiento * 100).toFixed(2)}% </strong>  de rendimiento</p>
      </div>
      <div className="columna-cosecha">
        <p><strong>{cosecha.numOlivos} </strong>  olivos cosechados</p>
        <p><strong>{cosecha.nombrePropiedad}</strong></p>
      </div>
    </div>
  </div>
);

};

export default TarjetaCosecha;
