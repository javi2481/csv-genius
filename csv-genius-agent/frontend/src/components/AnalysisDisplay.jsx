import React, { useState } from 'react';

const TabButton = ({ title, isActive, onClick }) => (
  <button
    className={`tab-button ${isActive ? 'active' : ''}`}
    onClick={onClick}
  >
    {title}
  </button>
);

const renderTablaEstadisticas = (estadisticas) => {
    if (!estadisticas || Object.keys(estadisticas).length === 0) return <p>No hay estadísticas numéricas para mostrar.</p>;

    const headers = Object.keys(estadisticas);
    const metrics = Object.keys(estadisticas[headers[0]] || {});

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Métrica</th>
                        {headers.map(h => <th key={h}>{h}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {metrics.map(metric => (
                        <tr key={metric}>
                            <td>{metric}</td>
                            {headers.map(h => <td key={`${h}-${metric}`}>{estadisticas[h][metric]}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


const AnalysisDisplay = ({ data }) => {
  const [activeTab, setActiveTab] = useState('resumen');

  if (!data || !data.ok || !data.analisis) {
    return null;
  }

  const { filas, columnas, tiempo_procesamiento, analisis } = data;
  const { 
    estadisticas_descriptivas, 
    valores_nulos,
    estadisticas_categoricas,
    matriz_correlacion,
    visualizaciones
  } = analisis;

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const renderContent = () => {
    switch (activeTab) {
      case 'resumen':
        return (
          <div className="tab-pane">
            <div className="metrics-grid">
              {/* Métricas de resumen */}
            </div>
            <div className="columns-section">
              <h3>Columnas del Dataset ({columnas.length})</h3>
              <div className="columns-list">
                {columnas.map((col, index) => <span key={index} className="column-tag">{col}</span>)}
              </div>
            </div>
          </div>
        );
      case 'numericas':
        return (
          <div className="tab-pane">
            <h3>Estadísticas Descriptivas</h3>
            {renderTablaEstadisticas(estadisticas_descriptivas)}
            <h3>Histogramas</h3>
            <div className="charts-grid">
              {Object.entries(visualizaciones.histogramas).map(([col, ruta]) => (
                <div key={col} className="chart-container">
                  <img src={`${API_BASE_URL}${ruta}`} alt={`Histograma de ${col}`} />
                </div>
              ))}
            </div>
          </div>
        );
      case 'categoricas':
        return (
          <div className="tab-pane">
            <h3>Estadísticas Categóricas</h3>
            {/* Tabla para estadísticas categóricas */}
            <h3>Valores Nulos</h3>
            {/* Tabla para valores nulos */}
            <h3>Gráficos de Frecuencia</h3>
            <div className="charts-grid">
              {Object.entries(visualizaciones.graficos_barras).map(([col, ruta]) => (
                <div key={col} className="chart-container">
                  <img src={`${API_BASE_URL}${ruta}`} alt={`Gráfico de ${col}`} />
                </div>
              ))}
            </div>
          </div>
        );
      case 'correlacion':
        return (
          <div>
            <h3>Matriz de Correlación</h3>
            {visualizaciones.heatmap_correlacion && (
              <div className="chart-container heatmap">
                <img src={`${API_BASE_URL}${visualizaciones.heatmap_correlacion}`} alt="Matriz de Correlación" />
              </div>
            )}
            {/* Aquí también podría ir la tabla de la matriz */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="analysis-dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Exploratorio</h2>
      </div>
      <div className="tabs-container">
        <TabButton title="Resumen General" isActive={activeTab === 'resumen'} onClick={() => setActiveTab('resumen')} />
        <TabButton title="Columnas Numéricas" isActive={activeTab === 'numericas'} onClick={() => setActiveTab('numericas')} />
        <TabButton title="Columnas Categóricas" isActive={activeTab === 'categoricas'} onClick={() => setActiveTab('categoricas')} />
        <TabButton title="Correlaciones" isActive={activeTab === 'correlacion'} onClick={() => setActiveTab('correlacion')} />
      </div>
      <div className="tab-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AnalysisDisplay; 