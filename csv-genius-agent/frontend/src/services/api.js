// api.js
// Funciones para comunicarse con el backend

const API_BASE_URL = 'http://localhost:8000';

// Función helper para manejar errores de red
const handleNetworkError = (error) => {
  console.error('Error de red:', error);
  return {
    ok: false,
    mensaje: 'Error de conexión con el servidor. Verifica que el backend esté ejecutándose.'
  };
};

// Función helper para hacer requests
const makeRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleNetworkError(error);
  }
};

// Función helper para hacer requests con FormData
const makeFormRequest = async (endpoint, formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleNetworkError(error);
  }
};

// Subir archivo CSV
export async function subirCSV(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  return makeFormRequest('/subir_csv', formData);
}

// Enviar pregunta al agente
export async function enviarPregunta(pregunta, modo = 'basico') {
  const formData = new FormData();
  formData.append('pregunta', pregunta);
  formData.append('modo', modo);
  
  return makeFormRequest('/preguntar', formData);
}

// Consultar OpenAI directamente
export async function consultarOpenAI(pregunta, contexto, modelo = 'gpt-3.5-turbo') {
  return makeRequest('/api/openai', {
    method: 'POST',
    body: JSON.stringify({
      pregunta,
      contexto,
      modelo
    })
  });
}

// Generar gráfico
export async function graficar(tipo, columna) {
  const formData = new FormData();
  formData.append('tipo', tipo);
  formData.append('columna', columna);
  
  return makeFormRequest('/graficar', formData);
}

// Obtener resumen del análisis
export async function obtenerResumen() {
  // Placeholder - implementar cuando esté disponible el endpoint
  return {
    ok: true,
    resumen: {
      filas: 1000,
      columnas: 5,
      numericas: ["edad", "ingresos"],
      categoricas: ["sexo", "region"],
      faltantes: { edad: 0, ingresos: 5, sexo: 2, region: 0 },
      estadisticas: {
        edad: { media: 35.6, mediana: 34, min: 18, max: 65 },
        ingresos: { media: 55000, mediana: 52000, min: 30000, max: 90000 }
      }
    }
  };
}

// Obtener estadísticas de una columna
export async function estadisticasColumna(nombreColumna) {
  // Placeholder - implementar cuando esté disponible el endpoint
  return {
    ok: true,
    estadisticas: {
      media: 45.6,
      mediana: 44,
      moda: 42,
      min: 18,
      max: 90,
      desviacion: 12.5,
      varianza: 156.3,
      conteo: 500
    }
  };
}

// Comparar dos columnas
export async function compararColumnas(col1, col2) {
  // Placeholder - implementar cuando esté disponible el endpoint
  return {
    ok: true,
    comparacion: {
      correlacion: 0.87,
      diferencia_media: 5000,
      nulos_comunes: 12
    }
  };
}

// Filtrar filas
export async function filtrarFilas(condicion, cantidad = 10) {
  // Placeholder - implementar cuando esté disponible el endpoint
  return {
    ok: true,
    resultado: [
      { edad: 35, ingresos: 42000, sexo: "F" },
      { edad: 42, ingresos: 37000, sexo: "M" }
    ]
  };
}

// Limpiar datos
export async function limpiarDatos(opciones) {
  // Placeholder - implementar cuando esté disponible el endpoint
  return {
    ok: true,
    mensaje: "Datos limpiados correctamente"
  };
}

// Exportar CSV
export async function exportarCSV() {
  // Placeholder - implementar cuando esté disponible el endpoint
  return {
    ok: true,
    contenido: "col1,col2\n10,20\n15,30\n"
  };
}

// Exportar resultados filtrados
export async function exportarFiltrado(condicion, cantidad) {
  return makeRequest('/exportar-filtrado', {
    method: 'POST',
    body: JSON.stringify({ condicion, cantidad })
  });
} 