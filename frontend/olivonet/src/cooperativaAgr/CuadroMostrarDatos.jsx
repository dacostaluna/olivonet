import { useEffect, useState } from "react";
import "./CuadroMostrarDatos.css";

const CuadroMostrarDatos = ({ valor = 0, medida = "", texto = "" }) => {
  const [valorAnimado, setValorAnimado] = useState(0);
  const [animacionTerminada, setAnimacionTerminada] = useState(false);

  useEffect(() => {
    const valorFinal = parseFloat(valor);
    const esEntero = valorFinal % 1 === 0;

    const pasos = 30;
    const duracion = 1000;

    let contador = 0;

    // Calcula incremento en función de si el valor tiene decimales
    const incremento = esEntero
      ? Math.ceil(valorFinal / pasos) || 1
      : valorFinal / pasos;

    const animacion = setInterval(() => {
      contador++;
      let nuevoValor = incremento * contador;

      if (
        (esEntero && nuevoValor >= valorFinal) ||
        (!esEntero && nuevoValor >= valorFinal - 0.01)
      ) {
        setValorAnimado(valorFinal);
        setAnimacionTerminada(true);
        clearInterval(animacion);
      } else {
        setValorAnimado(nuevoValor);
      }
    }, duracion / pasos);

    return () => clearInterval(animacion);
  }, [valor]);

  const mostrarValor = () => {
    const valorFinal = parseFloat(valor);
    const esEntero = valorFinal % 1 === 0;

    if (!animacionTerminada) {
      return esEntero
        ? Math.floor(valorAnimado).toString()
        : valorAnimado.toFixed(2);
    }

    return esEntero
      ? Math.round(valorFinal).toString()
      : valorFinal.toFixed(2);
  };

  return (
    <div className="cuadro-datos">
      <div className="valor">
        <span className="numero">{mostrarValor()}</span>
        {medida && <span className="medida">{medida}</span>}
      </div>
      <div className="texto">{texto}</div>
    </div>
  );
};

export default CuadroMostrarDatos;
