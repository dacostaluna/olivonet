import './CuadroAgricultor.css';
import fotoDefault from '../../assets/default_perfil.jpg';

const CuadroAgricultor = ({ agricultor }) => {
  const {
    nombre,
    apellidos,
    correo,
    dni,
    username,
    fechaNacimiento,
    fotoPerfil,
  } = agricultor;

  return (
    <div className="cuadro-agricultor">
      <div className="foto-perfil-vista-coop">
        <img src={fotoPerfil || fotoDefault} alt="Foto perfil" />
      </div>

      <div className="info-agricultor">
        <h3>{nombre} {apellidos}</h3>
        <p><strong>Correo:</strong> {correo}</p>
        <p><strong>DNI:</strong> {dni}</p>
        <p><strong>Usuario:</strong> {username}</p>
        <p><strong>Fecha de nacimiento:</strong> {new Date(fechaNacimiento).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default CuadroAgricultor;
