import React, { useState } from "react";
import { Pencil } from "lucide-react";
import "./CampoEditable.css";

const CampoEditable = ({ titulo, valorInicial, editable, onChange }) => {
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState(valorInicial);

  const handleInputChange = (e) => {
    setValor(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="campo-editable">
      <label className="campo-titulo">{titulo}</label>
      <div className={`campo-valor ${editable ? "editable" : "no-editable"} ${editando ? "activo" : ""}`}>
        {editando && editable ? (
          <input
            type="text"
            value={valor}
            onChange={handleInputChange}
            onBlur={() => setEditando(false)}
            className="campo-input"
            autoFocus
          />
        ) : (
          <span className={`campo-texto ${editable ? "editable-hover" : ""}`}>
            {valor || "—"}
          </span>
        )}

        {editable && !editando && (
          <Pencil
            size={16}
            className="icono-lapiz"
            onClick={() => setEditando(true)}
          />
        )}
      </div>
    </div>
  );
};

export default CampoEditable;
