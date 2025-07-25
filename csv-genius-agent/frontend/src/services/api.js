// api.js
// Funciones para interactuar con la API del backend (subir CSV, preguntar, graficar, etc.)

// Ejemplo de función (a completar luego):
// export async function subirCSV(file) { ... }

export async function exportarFiltrado(condicion, cantidad) {
  try {
    const response = await fetch('/exportar-filtrado', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ condicion, cantidad }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      ok: false,
      mensaje: 'Error de red al exportar filtrado',
    };
  }
} 