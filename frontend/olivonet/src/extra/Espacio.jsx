import React from 'react';

const Espacio = ({ altura = "15px", anchura = "0px" }) => {
  return <div style={{ height: altura, width: anchura }} />;
};

export default Espacio;
