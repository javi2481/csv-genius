import axios from 'axios';
import React, { useState } from 'react';
import './App.css';
import AnalysisDisplay from './components/AnalysisDisplay'; // Importar el nuevo componente

// URL base del backend de FastAPI
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null); // Cambiado a null
  const [queryResult, setQueryResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAnalysisResult(null); // Limpiar resultado anterior
    setQueryResult('');
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor, selecciona un archivo primero.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    
    setIsLoading(true);
    setError('');
    setAnalysisResult(null); // Limpiar resultado anterior al iniciar la subida
    try {
      const response = await axios.post(`${API_URL}/subir_csv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log("--- DEBUG: Respuesta recibida en el frontend ---");
      console.log(response.data);
      console.log("-----------------------------------------------");

      setAnalysisResult(response.data); 
    } catch (err) {
      const errorMessage = err.response?.data?.mensaje || err.message;
      setError(`Error al subir el archivo: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAsk = async () => {
    if (!query) {
      setError('Por favor, ingresa una pregunta.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_URL}/preguntar`, new URLSearchParams({ pregunta: query, modo: 'openai' }));
      setQueryResult(JSON.stringify(response.data, null, 2));
    } catch (err) {
      const errorMessage = err.response?.data?.mensaje || err.message;
      setError(`Error al procesar la pregunta: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>CSV Genius Agent</h1>
        <p>Sube un archivo CSV y hazle preguntas.</p>
      </header>
      <main className="App-main">
        {error && <div className="error-message">{error}</div>}
        {isLoading && <div className="loader">Cargando...</div>}
        
        <div className="card">
          <h2>1. Cargar y Analizar CSV</h2>
          <input type="file" onChange={handleFileChange} accept=".csv" />
          <button onClick={handleUpload} disabled={isLoading || !file}>
            {isLoading ? 'Subiendo...' : 'Subir y Analizar'}
          </button>
          {/* Usar el nuevo componente para mostrar los resultados */}
          <AnalysisDisplay data={analysisResult} />
        </div>

        <div className="card">
          <h2>2. Hacer una Pregunta</h2>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej: ¿Cuál es la media de la columna 'edad'?"
          />
          <button onClick={handleAsk} disabled={isLoading || !query}>
            {isLoading ? 'Procesando...' : 'Preguntar'}
          </button>
          {queryResult && (
            <div className="result-container">
              <h3>Respuesta:</h3>
              <pre>{queryResult}</pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
