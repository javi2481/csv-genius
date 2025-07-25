import React from 'react';
import { estilosGenerales } from '../styles/estilosGenerales';

const SelectorCantidadFilas = ({
  valor,
  onChange,
  deshabilitado = false,
  opciones = [5, 10, 20, 50],
  etiqueta = 'Filas a mostrar:'
}) => {
  return (
    <div style={estilosGenerales.grupoControles}>
      <label style={{ fontSize: 14 }}>
        {etiqueta}
        <select
          value={valor}
          onChange={onChange}
          disabled={deshabilitado}
          style={{ ...estilosGenerales.select, marginLeft: 8 }}
        >
          {opciones.map(opcion => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default SelectorCantidadFilas; 