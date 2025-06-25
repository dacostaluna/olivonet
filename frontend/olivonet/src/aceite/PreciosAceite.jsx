import React, { useEffect, useState } from "react";
import "./PreciosAceite.css";

const PreciosAceite = () => {
  const [precios, setPrecios] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/aceite/precio")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener precios");
        return res.json();
      })
      .then((data) => setPrecios(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="precios-aceite">
      <p className="subtitulo-aceite">Variedad Picual</p>

      {error && <p className="error-aceite">{error}</p>}
      {!precios && !error && <p className="cargando-aceite">Cargando...</p>}

      {precios && (
        <div className="tabla-precios">
          <div className="linea-aceite grande-aceite">
            <span className="etiqueta-aceite">Virgen extra:</span>
            <span className="valor-aceite">{precios.virgen_extra}</span>
          </div>
          <div className="linea-aceite">
            <span className="etiqueta-aceite">Virgen:</span>
            <span className="valor-aceite">{precios.virgen}</span>
          </div>
          <div className="linea-aceite">
            <span className="etiqueta-aceite">Lampante:</span>
            <span className="valor-aceite">{precios.lampante}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreciosAceite;
