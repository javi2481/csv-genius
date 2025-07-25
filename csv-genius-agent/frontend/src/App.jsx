// App.jsx
// Componente principal de la aplicación React. Aquí se orquestarán los componentes y la lógica general.

import React, { useState } from 'react';

function App() {
  // Estado para saber si hay archivo subido (luego se conectará con backend)
  const [csvCargado, setCsvCargado] = useState(false);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <header style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1>CSV Genius Agent</h1>
        <p>Subí tu archivo CSV, hacé preguntas en lenguaje natural y visualizá los datos fácilmente.</p>
      </header>

      {/* Sección 1: Subir CSV */}
      <section style={{ marginBottom: 32 }}>
        <h2>1. Cargar archivo CSV</h2>
        {/* Aquí irá el componente FormularioCSV */}
        <div style={{ border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
          <p>Formulario para subir el archivo CSV (próximamente).</p>
        </div>
      </section>

      {/* Sección 2: Preguntar al agente */}
      <section style={{ marginBottom: 32 }}>
        <h2>2. Preguntar al agente</h2>
        {/* Aquí irá el componente PreguntaAgente */}
        <div style={{ border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
          <p>Formulario para escribir preguntas en lenguaje natural (próximamente).</p>
        </div>
      </section>

      {/* Sección 3: Visualizar gráficos */}
      <section>
        <h2>3. Visualizar gráficos</h2>
        {/* Aquí irá el componente VisualizadorGraficos */}
        <div style={{ border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
          <p>Zona para mostrar los gráficos generados (próximamente).</p>
        </div>
      </section>

      {/* Mensaje de bienvenida si no hay CSV */}
      {!csvCargado && (
        <div style={{ marginTop: 40, textAlign: 'center', color: '#888' }}>
          <p>¡Bienvenido! Para comenzar, subí un archivo CSV.</p>
        </div>
      )}
    </div>
  );
}

export default App; 