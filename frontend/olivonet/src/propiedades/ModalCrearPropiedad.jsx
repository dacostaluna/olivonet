import React from "react";
import Mensaje from "../extra/Mensaje";
import Formulario from "../extra/Formulario";
import "./ModalCrearPropiedad.css";

const ModalCrearPropiedad = ({
  nuevaPropiedad,
  handleInputChange,
  handleSubmit,
  mensaje,
  onCerrar,
}) => {
  return (
    <div className="modal-crearprop-fondo" onClick={onCerrar}>
      <div
        className="modal-crearprop-contenido"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-crearprop-cerrar"
          onClick={onCerrar}
          aria-label="Cerrar modal"
        >
          ×
        </button>
        <h2 className="modal-crearprop-titulo">Crear Nueva Propiedad</h2>

        <form onSubmit={handleSubmit}>
          <div className="modal-crearprop-formulario">
            <div className="modal-crearprop-columna">
              <Formulario
                texto="Nombre"
                value={nuevaPropiedad.nombre}
                onChange={handleInputChange("nombre")}
                required
              />
              <Formulario
                texto="Tipo"
                value={nuevaPropiedad.tipo}
                onChange={handleInputChange("tipo")}
                required
              />
              <Formulario
                texto="Coordenadas"
                placeholder="Latitud, longitud"
                value={nuevaPropiedad.coordenadas}
                onChange={handleInputChange("coordenadas")}
                required
              />
              <Formulario
                texto="Superficie"
                placeholder="Ej: 22 m²"
                type="number"
                value={nuevaPropiedad.superficie}
                onChange={handleInputChange("superficie")}
                width="120px"
                required
              />
            </div>

            <div className="modal-crearprop-columna">
              <Formulario
                texto="Descripción"
                placeholder=""
                value={nuevaPropiedad.descripcion}
                onChange={handleInputChange("descripcion")}
                height="8rem"
                esArea={true} // aquí indicas que quieres textarea
                required
              />

              <Formulario
                texto="Dirección"
                placeholder="Dirección completa"
                value={nuevaPropiedad.direccion}
                onChange={handleInputChange("direccion")}
                required
              />
            </div>
          </div>

          <button type="submit" className="modal-crearprop-confirmar">
            Guardar
          </button>

          <Mensaje tipo={mensaje?.tipo} texto={mensaje?.texto} />
        </form>
      </div>
    </div>
  );
};

export default ModalCrearPropiedad;
