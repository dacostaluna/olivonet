import React from "react";
import PropTypes from "prop-types";

import "./Mensaje.css"; // Asegúrate de tener el estilo correspondiente

const Mensaje = ({ tipo, texto }) => {
  if (!texto) return null;

  return (
    <p className={`mensaje ${tipo === "error" ? "error" : "exito"}`}>
      {texto}
    </p>
  );
};

Mensaje.propTypes = {
  tipo: PropTypes.oneOf(["exito", "error"]).isRequired,
  texto: PropTypes.string.isRequired,
};

export default Mensaje;
