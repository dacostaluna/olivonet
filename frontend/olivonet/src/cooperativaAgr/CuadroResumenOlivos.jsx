import { useEffect, useState } from "react";
import "./CuadroMostrarDatos.css";
import "./CuadroResumenOlivos.css";

const CuadroResumenOlivos = ({ total = 0, cosechados = 0 }) => {
  const [animadoTotal, setAnimadoTotal] = useState(0);
  const [animadoCosechados, setAnimadoCosechados] = useState(0);

  useEffect(() => {
    const pasos = 30;
    const duracion = 1000;

    const animar = (valorFinal, setValor) => {
      let contador = 0;
      const incremento = (valorFinal - 0) / pasos;

      const intervalo = setInterval(() => {
        contador++;
        const nuevoValor = 0 + incremento * contador;
        setValor(nuevoValor >= valorFinal ? valorFinal : nuevoValor);
        if (contador >= pasos) clearInterval(intervalo);
      }, duracion / pasos);
    };

    animar(total, setAnimadoTotal);
    animar(cosechados, setAnimadoCosechados);
  }, [total, cosechados]);

  const restantes = Math.max(0, animadoTotal - animadoCosechados);

return (
  <div className="cuadro-datos cuadro-datos-olivos">
    <div className="linea-dato">
      <span className="texto-olivos">Total de olivos:</span>
      <span className="valor valor-olivos">{Math.round(animadoTotal)}</span>
    </div>
    <div className="linea-dato">
      <span className="texto-olivos">Cosechados:</span>
      <span className="valor valor-olivos">{Math.round(animadoCosechados)}</span>
    </div>
    <div className="linea-dato">
      <span className="texto-olivos">Restantes:</span>
      <span className="valor valor-olivos">{Math.round(restantes)}</span>
    </div>
  </div>
);

};

export default CuadroResumenOlivos;
