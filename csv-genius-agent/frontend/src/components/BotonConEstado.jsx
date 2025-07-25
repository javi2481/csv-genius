import React from 'react';
import { getEstiloBoton } from '../styles/estilosGenerales';

const BotonConEstado = ({
  onClick,
  texto,
  textoCargando = 'Cargando...',
  deshabilitado = false,
  cargando = false,
  secundario = false,
  tipo = 'button',
  ...props
}) => {
  const estaDeshabilitado = deshabilitado || cargando;
  const textoMostrado = cargando ? textoCargando : texto;

  return (
    <button
      type={tipo}
      onClick={onClick}
      disabled={estaDeshabilitado}
      style={getEstiloBoton(estaDeshabilitado, secundario)}
      {...props}
    >
      {textoMostrado}
    </button>
  );
};

export default BotonConEstado; 