import React from 'react';
import { estilosGenerales, getEstiloInput } from '../styles/estilosGenerales';

const InputConEtiqueta = ({
  etiqueta,
  valor,
  onChange,
  placeholder = '',
  tipo = 'text',
  deshabilitado = false,
  required = false,
  ...props
}) => {
  return (
    <div>
      <label style={estilosGenerales.label}>
        {etiqueta}
        {required && <span style={{ color: 'red' }}> *</span>}
      </label>
      <input
        type={tipo}
        value={valor}
        onChange={onChange}
        placeholder={placeholder}
        disabled={deshabilitado}
        style={getEstiloInput(deshabilitado)}
        {...props}
      />
    </div>
  );
};

export default InputConEtiqueta; 