import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage('');
    setFileUploaded(false);
    setAnalysis(null);
    setChatHistory([]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Por favor, selecciona un archivo primero.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
            const response = await axios.post('http://localhost:8001/upload-csv/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
      setFileUploaded(true);
      setAnalysis(null);
      setChatHistory([]);
    } catch (error) {
      setMessage('Error al subir el archivo. Asegúrate de que el backend está funcionando.');
      console.error('Error uploading file:', error);
      setFileUploaded(false);
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setAnalysis(null);
    setMessage('');
    try {
            const response = await axios.post('http://localhost:8001/analyze/');
      if (response.data.error) {
        setMessage(response.data.error);
      } else {
        setAnalysis(response.data);
      }
    } catch (error) {
      setMessage('Error al realizar el análisis.');
      console.error('Error analyzing file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const newHistory = [...chatHistory, { sender: 'user', text: query }];
    setChatHistory(newHistory);
    setQuery('');

    try {
      const response = await axios.post('http://localhost:8001/ask/', { query });
      const answer = response.data.answer;

      let botMessage = { sender: 'bot', text: answer, chartUrl: null };

      if (answer.includes('[CHART]')) {
        const parts = answer.split('[CHART]');
        botMessage.text = parts[0];
        botMessage.chartUrl = `http://localhost:8001${parts[1]}`;
      }

      setChatHistory([...newHistory, botMessage]);
    } catch (error) {
      setChatHistory([...newHistory, { sender: 'bot', text: 'Lo siento, ocurrió un error al procesar tu pregunta.' }]);
      console.error('Error asking question:', error);
    }
  };

  const renderTable = (data) => {
    const headers = Object.keys(data);
    const rows = Object.keys(data[headers[0]]);
    return (
      <table className="summary-table">
        <thead>
          <tr>
            <th>Estadística</th>
            {headers.map(header => <th key={header}>{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row}>
              <td>{row}</td>
              {headers.map(header => <td key={`${header}-${row}`}>{data[header][row]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>CSV Genius Agent 🧠</h1>
        <p>Sube tu archivo CSV y hazle preguntas en lenguaje natural.</p>
      </header>
      <main className="App-main">
        <div className="upload-container">
          <h2>1. Carga tu archivo CSV</h2>
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <button onClick={handleUpload}>Subir Archivo</button>
          {fileUploaded && (
            <button onClick={handleAnalyze} disabled={isLoading} className="analyze-button">
              {isLoading ? 'Analizando...' : 'Analizar Archivo'}
            </button>
          )}
          {message && <p className="message">{message}</p>}
        </div>

        {fileUploaded && (
          <div className="chat-section-container">
            <h2>2. Hacé tus preguntas</h2>
            <div className="chat-container" ref={chatContainerRef}>
              {chatHistory.map((chat, index) => (
                <div key={index} className={`chat-bubble ${chat.sender}`}>
                  <p>{chat.text}</p>
                  {chat.chartUrl && (
                    <div className="chart-image-container">
                      <img src={chat.chartUrl} alt="Chart" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <form onSubmit={handleAsk} className="chat-form">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ej: ¿Cuál es la media de la columna 'edad'?"
              />
              <button type="submit">Enviar</button>
            </form>
          </div>
        )}

        {analysis && (
          <div className="analysis-container">
            <h2>Análisis del Archivo</h2>
            
            <h3>Resumen Estadístico</h3>
            <div className="table-container">{renderTable(analysis.summary)}</div>

            <h3>Tipos de Datos por Columna</h3>
            <ul>
              {Object.entries(analysis.data_types).map(([col, type]) => (
                <li key={col}><strong>{col}:</strong> {type}</li>
              ))}
            </ul>

            <h3>Valores Nulos por Columna</h3>
            <ul>
              {Object.entries(analysis.null_values).map(([col, count]) => (
                <li key={col}><strong>{col}:</strong> {count}</li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
