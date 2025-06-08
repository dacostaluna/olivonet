import React, { useEffect, useState } from "react";
import axios from "axios";
import CampoEditable from "../perfil/CampoEditable";
import Formulario from "../extra/Formulario";
import Mensaje from "../extra/Mensaje";
import Espacio from "../extra/Espacio";
import "./Propiedad.css";
import PanelTiempo from "./tiempo/PanelTiempo";
import CoordenadasSelector from "./tiempo/CoordenadasSelector";
import ModalMapa from "./tiempo/ModalMapa";

const variedadesAceituna = ["Arbequina", "Picual", "Hojiblanca", "Cornicabra"];

const Propiedad = ({ idPropiedad, volver }) => {
  const [propiedad, setPropiedad] = useState(null);
  const [formData, setFormData] = useState(null);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [cambios, setCambios] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const fetchPropiedad = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/mis-propiedades/${idPropiedad}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPropiedad(response.data);
        setFormData({
          nombre: response.data.nombre || "",
          color: response.data.color || "#ccc",
          variedad: response.data.variedad || "",
          superficie: response.data.superficie?.toString() || "",
          coordenadas: response.data.coordenadas || "",
          direccion: response.data.direccion || "",
          descripcion: response.data.descripcion || "",
          numOlivos: response.data.numOlivos?.toString() || "",
          tieneRiego: !!response.data.tieneRiego,
          numOlivosRiego: response.data.numOlivosRiego?.toString() || "",
          edadOlivos: response.data.edadOlivos?.toString() || "",
        });
        setCambios(false);
      } catch (error) {
        console.error("Error al obtener la propiedad:", error);
      }
    };

    fetchPropiedad();
  }, [idPropiedad]);

  // Función para comparar formData y propiedad y detectar si hay cambios reales
  const hayCambiosReales = () => {
    if (!formData || !propiedad) return false;
    return (
      formData.nombre !== (propiedad.nombre || "") ||
      formData.color !== (propiedad.color || "#ccc") ||
      formData.variedad !== (propiedad.variedad || "") ||
      formData.superficie !== (propiedad.superficie?.toString() || "") ||
      formData.coordenadas !== (propiedad.coordenadas || "") ||
      formData.direccion !== (propiedad.direccion || "") ||
      formData.descripcion !== (propiedad.descripcion || "") ||
      formData.numOlivos !== (propiedad.numOlivos?.toString() || "") ||
      formData.tieneRiego !== !!propiedad.tieneRiego ||
      formData.numOlivosRiego !==
        (propiedad.numOlivosRiego?.toString() || "") ||
      formData.edadOlivos !== (propiedad.edadOlivos?.toString() || "")
    );
  };

  const esFormularioValido = () => {
    return camposNumericos.every((campo) => /^\d*$/.test(formData[campo]));
  };

  const camposNumericos = [
    "superficie",
    "numOlivos",
    "numOlivosRiego",
    "edadOlivos",
  ];

  const handleCampoChange = (campo, valor) => {
    // Si es campo numérico, solo dejamos números o string vacío
    if (camposNumericos.includes(campo)) {
      if (!/^\d*$/.test(valor)) return; // ignora si no es numérico
    }

    setFormData((prev) => {
      if (campo === "tieneRiego" && valor === false) {
        return {
          ...prev,
          tieneRiego: false,
          numOlivosRiego: "",
        };
      }
      return {
        ...prev,
        [campo]: valor,
      };
    });

    setCambios(true);
  };

  useEffect(() => {
    setCambios(hayCambiosReales());
  }, [formData]);

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        nombre: formData.nombre,
        color: formData.color,
        variedad: formData.variedad,
        superficie: Number(formData.superficie) || 0,
        coordenadas: formData.coordenadas,
        direccion: formData.direccion,
        descripcion: formData.descripcion,
        numOlivos: Number(formData.numOlivos) || 0,
        tieneRiego: formData.tieneRiego,
        numOlivosRiego: formData.tieneRiego
          ? Number(formData.numOlivosRiego) || 0
          : 0,
        edadOlivos: Number(formData.edadOlivos) || 0,
      };

      await axios.put(
        `http://localhost:5000/actualizar-propiedad/${idPropiedad}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPropiedad(payload);
      setMensaje({
        tipo: "exito",
        texto: "Propiedad actualizada correctamente.",
      });
      setCambios(false);
    } catch (error) {
      console.error("Error al guardar propiedad:", error);
      setMensaje({ tipo: "error", texto: "Error al guardar la propiedad." });
    }
    setGuardando(false);
    setTimeout(() => setMensaje({ tipo: "", texto: "" }), 3000);
  };

  const handleEliminarPropiedad = async () => {
    const confirmar = window.confirm(
      "¿Estás seguro de que quieres eliminar esta propiedad?"
    );
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/eliminar-propiedad/${idPropiedad}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      volver(); // volver a la vista anterior
    } catch (error) {
      console.error("Error al eliminar la propiedad:", error);
      setMensaje({ tipo: "error", texto: "Error al eliminar la propiedad." });
      setTimeout(() => setMensaje({ tipo: "", texto: "" }), 3000);
    }
  };

  return (
    <div className="detalle-propiedad" style={{ paddingTop: "60px" }}>
      <button onClick={volver} className="btn-volver" title="Volver">
        &lt;
      </button>

      {!propiedad || !formData ? (
        <p>Cargando propiedad...</p>
      ) : (
        <>
          <h1
            className="titulo-propiedad"
            style={{ backgroundColor: propiedad.color || "#ccc" }}
          >
            {propiedad.nombre}
          </h1>

          <Espacio />
          <div className="propiedad-main">
            <div className="propiedad-informacion-contenedor">
              <p className="propiedad-olivos">
                <strong className="num-olivos"> {formData.numOlivos || ""}</strong>
                <Espacio anchura="10px"/>
                <p className="palabra-olivos">Olivos</p>
              </p>
              <p className="propiedad-informacion">
              {formData.descripcion || ""}
              </p>
              <p className="propiedad-informacion">
                <strong> {formData.direccion || ""}</strong>
              </p>
            </div>
            <div className="panel-tiempo-propiedad">
              <PanelTiempo direccion={formData.direccion} />
            </div>
          </div>

          <ModalMapa/>

          <Espacio />

          <Mensaje tipo={mensaje.tipo} texto={mensaje.texto} />
          <h3>Información personal</h3>
          <p className="perfil-informacion">
            Aquí puedes editar la información de tu propiedad. Asegúrate de que
            registras todos los datos necesarios.
          </p>
          <CampoEditable
            titulo="Nombre"
            valorInicial={formData.nombre}
            editable={true}
            onChange={(v) => handleCampoChange("nombre", v)}
          />

          <Formulario
            texto="Variedad"
            type="select"
            value={formData.variedad}
            opciones={variedadesAceituna}
            onChange={(e) => handleCampoChange("variedad", e.target.value)}
          />

          <CampoEditable
            titulo="Superficie"
            valorInicial={formData.superficie}
            editable={true}
            onChange={(v) => handleCampoChange("superficie", v)}
          />

          <CampoEditable
            titulo="Coordenadas"
            valorInicial={formData.coordenadas}
            editable={true}
            onChange={(v) => handleCampoChange("coordenadas", v)}
          />

          <CampoEditable
            titulo="Dirección"
            valorInicial={formData.direccion}
            editable={true}
            onChange={(v) => handleCampoChange("direccion", v)}
          />

          <CampoEditable
            titulo="Descripción"
            valorInicial={formData.descripcion}
            editable={true}
            onChange={(v) => handleCampoChange("descripcion", v)}
          />

          <CampoEditable
            titulo="Número de olivos"
            valorInicial={formData.numOlivos}
            editable={true}
            onChange={(v) => handleCampoChange("numOlivos", v)}
          />

          <Formulario
            texto="Tiene riego"
            type="checkbox"
            value={formData.tieneRiego}
            onChange={(e) => handleCampoChange("tieneRiego", e.target.checked)}
          />

          <CampoEditable
            titulo="Número de olivos con riego"
            valorInicial={formData.numOlivosRiego}
            editable={formData.tieneRiego}
            onChange={(v) => handleCampoChange("numOlivosRiego", v)}
          />

          <CampoEditable
            titulo="Edad de los olivos"
            valorInicial={formData.edadOlivos}
            editable={true}
            onChange={(v) => handleCampoChange("edadOlivos", v)}
          />

          <button
            className="btn-guardar"
            disabled={!cambios || guardando || !esFormularioValido()}
            onClick={handleGuardar}
          >
            {guardando ? "Guardando..." : "Guardar información"}
          </button>

          <Espacio />

          <h3>Eliminar propiedad</h3>
          <p className="perfil-informacion">
            Elimina la propiedad si ya no necesitas registrarla. Esta acción
            <strong> es irreversible</strong> y eliminará todos los datos
            asociados a la propiedad.
          </p>
          <button
            className="btn-eliminar-cuenta"
            onClick={handleEliminarPropiedad}
          >
            Eliminar propiedad
          </button>
        </>
      )}
    </div>
  );
};

export default Propiedad;
