// estilosGenerales.js
// Estilos centralizados para componentes reutilizables del proyecto

export const estilosGenerales = {
  // Contenedores
  contenedor: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    maxWidth: 600,
  },
  contenedorCompacto: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    maxWidth: 400,
  },
  
  // Inputs
  input: {
    padding: 8,
    border: '1px solid #ccc',
    borderRadius: 4,
    fontSize: 14,
  },
  inputDeshabilitado: {
    padding: 8,
    border: '1px solid #ccc',
    borderRadius: 4,
    fontSize: 14,
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  
  // Labels
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  
  // Botones
  boton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: 4,
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    fontSize: 14,
    transition: 'background-color 0.2s',
  },
  botonDeshabilitado: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: 4,
    backgroundColor: '#ccc',
    color: '#666',
    cursor: 'not-allowed',
    fontSize: 14,
  },
  botonSecundario: {
    padding: '8px 16px',
    border: '1px solid #007bff',
    borderRadius: 4,
    backgroundColor: 'white',
    color: '#007bff',
    cursor: 'pointer',
    fontSize: 14,
    transition: 'background-color 0.2s',
  },
  
  // Select
  select: {
    padding: 8,
    border: '1px solid #ccc',
    borderRadius: 4,
    fontSize: 14,
    backgroundColor: 'white',
  },
  
  // Mensajes
  mensajeExito: {
    color: 'green',
    marginTop: 8,
    fontSize: 14,
  },
  mensajeError: {
    color: 'red',
    marginTop: 8,
    fontSize: 14,
  },
  mensajeInfo: {
    color: '#666',
    marginTop: 8,
    fontSize: 14,
  },
  
  // Grupos de controles
  grupoControles: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  
  // Espaciado
  margenSuperior: {
    marginTop: 16,
  },
  margenInferior: {
    marginBottom: 16,
  },
};

// Funciones auxiliares para estilos dinámicos
export const getEstiloInput = (deshabilitado = false) => 
  deshabilitado ? estilosGenerales.inputDeshabilitado : estilosGenerales.input;

export const getEstiloBoton = (deshabilitado = false, secundario = false) => {
  if (deshabilitado) return estilosGenerales.botonDeshabilitado;
  return secundario ? estilosGenerales.botonSecundario : estilosGenerales.boton;
}; 