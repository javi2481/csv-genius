// App.jsx
// Componente principal de la aplicación React. Aquí se orquestarán los componentes y la lógica general.

import React, { useState } from 'react';
import SubirArchivo from './components/SubirArchivo';
import FormularioPregunta from './components/FormularioPregunta';
import VisualizarGrafico from './components/VisualizarGrafico';
import MostrarPerfilado from './components/MostrarPerfilado';
import VerEstadisticasColumna from './components/VerEstadisticasColumna';
import CompararColumnas from './components/CompararColumnas';
import FiltrarFilas from './components/FiltrarFilas';
import LimpiarDatos from './components/LimpiarDatos';
import ExportarCSV from './components/ExportarCSV';
import DescargarResumen from './components/DescargarResumen';
import { estilosGenerales } from './styles/estilosGenerales';

const estilosLayout = {
  contenedor: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  sidebar: {
    width: 280,
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '20px 0',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
  },
  header: {
    padding: '0 20px 20px 20px',
    borderBottom: '1px solid #34495e',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: '0 0 8px 0',
  },
  subtitulo: {
    fontSize: 14,
    color: '#bdc3c7',
    margin: 0,
  },
  fecha: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 8,
  },
  menu: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  menuItem: {
    padding: '12px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    borderLeft: '3px solid transparent',
  },
  menuItemActivo: {
    backgroundColor: '#34495e',
    borderLeftColor: '#3498db',
  },
  menuItemHover: {
    backgroundColor: '#34495e',
  },
  menuTexto: {
    fontSize: 14,
    margin: 0,
  },
  contenido: {
    flex: 1,
    padding: '30px',
    backgroundColor: '#f8f9fa',
    overflowY: 'auto',
  },
  vista: {
    maxWidth: 800,
    margin: '0 auto',
  },
  footer: {
    marginTop: 40,
    padding: '20px 0',
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: 12,
    borderTop: '1px solid #ecf0f1',
  },
  alerta: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeaa7',
    color: '#856404',
    padding: '12px 16px',
    borderRadius: 4,
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
};

const App = () => {
  const [vista, setVista] = useState('subir');
  const [csvCargado, setCsvCargado] = useState(false);
  const [hoverItem, setHoverItem] = useState(null);

  const getFechaActual = () => {
    return new Date().toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const menuItems = [
    { id: 'subir', texto: '📁 Subir archivo', requiereCSV: false },
    { id: 'perfilado', texto: '📊 Mostrar perfilado', requiereCSV: true },
    { id: 'preguntar', texto: '❓ Preguntar sobre CSV', requiereCSV: true },
    { id: 'grafico', texto: '📈 Visualizar gráfico', requiereCSV: true },
    { id: 'estadisticas', texto: '📋 Estadísticas por columna', requiereCSV: true },
    { id: 'comparar', texto: '⚖️ Comparar columnas', requiereCSV: true },
    { id: 'filtrar', texto: '🔍 Filtrar filas', requiereCSV: true },
    { id: 'limpiar', texto: '🧹 Limpiar datos', requiereCSV: true },
    { id: 'exportar', texto: '💾 Exportar CSV', requiereCSV: true },
    { id: 'descargar', texto: '📥 Descargar resumen', requiereCSV: true },
  ];

  const handleUploadSuccess = () => {
    setCsvCargado(true);
  };

  const renderVista = () => {
    const props = { onUploadSuccess: handleUploadSuccess };

    switch (vista) {
      case 'subir':
        return <SubirArchivo {...props} />;
      case 'perfilado':
        return <MostrarPerfilado />;
      case 'preguntar':
        return <FormularioPregunta />;
      case 'grafico':
        return <VisualizarGrafico />;
      case 'estadisticas':
        return <VerEstadisticasColumna />;
      case 'comparar':
        return <CompararColumnas />;
      case 'filtrar':
        return <FiltrarFilas />;
      case 'limpiar':
        return <LimpiarDatos />;
      case 'exportar':
        return <ExportarCSV />;
      case 'descargar':
        return <DescargarResumen />;
      default:
        return <SubirArchivo {...props} />;
    }
  };

  const handleMenuClick = (itemId) => {
    const item = menuItems.find(i => i.id === itemId);
    if (!item.requiereCSV || csvCargado) {
      setVista(itemId);
    }
  };

  return (
    <div style={estilosLayout.contenedor}>
      {/* Sidebar */}
      <div style={estilosLayout.sidebar}>
        <div style={estilosLayout.header}>
          <h1 style={estilosLayout.titulo}>CSV Genius Agent</h1>
          <p style={estilosLayout.subtitulo}>Exploración inteligente de datos</p>
          <div style={estilosLayout.fecha}>{getFechaActual()}</div>
        </div>
        
        <ul style={estilosLayout.menu}>
          {menuItems.map((item) => {
            const estaActivo = vista === item.id;
            const estaDeshabilitado = item.requiereCSV && !csvCargado;
            const estaHover = hoverItem === item.id;
            
            return (
              <li
                key={item.id}
                style={{
                  ...estilosLayout.menuItem,
                  ...(estaActivo && estilosLayout.menuItemActivo),
                  ...(estaHover && !estaDeshabilitado && estilosLayout.menuItemHover),
                  opacity: estaDeshabilitado ? 0.5 : 1,
                  cursor: estaDeshabilitado ? 'not-allowed' : 'pointer',
                }}
                onClick={() => !estaDeshabilitado && handleMenuClick(item.id)}
                onMouseEnter={() => setHoverItem(item.id)}
                onMouseLeave={() => setHoverItem(null)}
              >
                <p style={estilosLayout.menuTexto}>{item.texto}</p>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Contenido principal */}
      <div style={estilosLayout.contenido}>
        <div style={estilosLayout.vista}>
          {/* Alerta si no hay CSV cargado */}
          {!csvCargado && vista !== 'subir' && (
            <div style={estilosLayout.alerta}>
              ⚠️ No hay archivo CSV cargado. Por favor, sube un archivo primero.
            </div>
          )}
          
          {/* Renderizar componente según vista activa */}
          {renderVista()}
        </div>

        {/* Footer */}
        <div style={estilosLayout.footer}>
          <p>CSV Genius Agent - Herramienta de análisis de datos inteligente</p>
          <p>Desarrollado con React + FastAPI + Python</p>
        </div>
      </div>
    </div>
  );
};

export default App; 