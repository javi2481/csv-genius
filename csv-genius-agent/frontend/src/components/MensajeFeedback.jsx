import React from 'react';
import { estilosGenerales } from '../styles/estilosGenerales';

const MensajeFeedback = ({
  tipo = 'info', // 'exito', 'error', 'info'
  mensaje,
  mostrar = true,
  conIcono = true
}) => {
  if (!mostrar || !mensaje) return null;

  const estilos = {
    exito: estilosGenerales.mensajeExito,
    error: estilosGenerales.mensajeError,
    info: estilosGenerales.mensajeInfo,
  };

  const iconos = {
    exito: '✅',
    error: '❌',
    info: 'ℹ️',
  };

  return (
    <div style={estilos[tipo]}>
      {conIcono && iconos[tipo]} {mensaje}
    </div>
  );
};

export default MensajeFeedback; 