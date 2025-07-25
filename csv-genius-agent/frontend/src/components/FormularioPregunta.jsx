// FormularioPregunta.jsx
// Permite al usuario escribir una pregunta sobre el CSV y elegir el modo de interpretación.

import React, { useState } from 'react';
import { enviarPregunta } from '../services/api';

const FormularioPregunta = () => {
  const [pregunta, setPregunta] = useState('');
  const [modo, setModo] = useState('basico');
  const [resultado, setResultado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    setResultado(null);
    if (!pregunta.trim()) {
      setError('Por favor, escribí una pregunta.');
      return;
    }
    setCargando(true);
    try {
      const resp = await enviarPregunta(pregunta, modo);
      if (resp.ok) {
        setResultado(resp.resultado);
        setMensaje(resp.mensaje || 'Pregunta procesada correctamente.');
      } else {
        setError(resp.mensaje || 'No se pudo procesar la pregunta.');
      }
    } catch (err) {
      setError('Error de red o el backend no responde.');
    } finally {
      setCargando(false);
    }
  };

  const renderResultado = () => {
    if (!resultado) return null;

    return (
      <div style={{ marginTop: 16, background: '#f8f8f8', padding: 12, borderRadius: 6 }}>
        {modo === 'openai' ? (
          // Resultado para modo OpenAI
          <div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ 
                background: '#007bff', 
                color: 'white', 
                padding: '2px 8px', 
                borderRadius: 4, 
                fontSize: 12 
              }}>
                🤖 OpenAI
              </span>
            </div>
            {resultado.valor !== undefined ? (
              // Resultado numérico (ej: media)
              <div>
                <div><b>Resultado:</b> {resultado.valor}</div>
                <div><b>Columna:</b> {resultado.columna}</div>
                <div><b>Descripción:</b> {resultado.mensaje}</div>
              </div>
            ) : resultado.ruta ? (
              // Resultado de gráfico
              <div>
                <div><b>Gráfico generado:</b></div>
                <img 
                  src={resultado.ruta} 
                  alt="Gráfico generado" 
                  style={{ maxWidth: '100%', marginTop: 8 }}
                />
                <div style={{ marginTop: 8 }}><b>Descripción:</b> {resultado.mensaje}</div>
              </div>
            ) : (
              // Resultado general
              <div>
                <div><b>Acción interpretada:</b> {resultado.accion}</div>
                {resultado.columna && <div><b>Columna:</b> {resultado.columna}</div>}
                <div><b>Respuesta:</b> {resultado.mensaje}</div>
              </div>
            )}
          </div>
        ) : (
          // Resultado para modo básico
          <div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ 
                background: '#28a745', 
                color: 'white', 
                padding: '2px 8px', 
                borderRadius: 4, 
                fontSize: 12 
              }}>
                🔍 Básico
              </span>
            </div>
            <div><b>Acción:</b> {resultado.accion}</div>
            <div><b>Columna:</b> {resultado.columna || 'N/A'}</div>
            <div><b>Mensaje:</b> {resultado.mensaje}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label style={{ fontWeight: 'bold' }}>Pregunta sobre el CSV</label>
      <input
        type="text"
        value={pregunta}
        onChange={e => setPregunta(e.target.value)}
        placeholder="Ej: ¿Cuál es la media de la columna edad?"
        disabled={cargando}
        style={{ padding: 8 }}
      />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <label>
          <input
            type="radio"
            name="modo"
            value="basico"
            checked={modo === 'basico'}
            onChange={() => setModo('basico')}
            disabled={cargando}
          />{' '}
          <span style={{ color: '#28a745' }}>🔍 Modo básico</span>
        </label>
        <label>
          <input
            type="radio"
            name="modo"
            value="openai"
            checked={modo === 'openai'}
            onChange={() => setModo('openai')}
            disabled={cargando}
          />{' '}
          <span style={{ color: '#007bff' }}>🤖 Modo OpenAI</span>
        </label>
      </div>
      
      <div style={{ 
        background: modo === 'openai' ? '#e3f2fd' : '#f1f8e9', 
        padding: 8, 
        borderRadius: 4, 
        fontSize: 12,
        border: `1px solid ${modo === 'openai' ? '#2196f3' : '#4caf50'}`
      }}>
        {modo === 'openai' ? (
          <>
            <strong>🤖 Modo OpenAI:</strong> Usa inteligencia artificial para interpretar preguntas complejas 
            y generar respuestas más naturales. Requiere conexión a internet.
          </>
        ) : (
          <>
            <strong>🔍 Modo básico:</strong> Usa palabras clave para interpretar preguntas simples. 
            Funciona sin conexión a internet.
          </>
        )}
      </div>
      
      <button type="submit" disabled={cargando} style={{ marginTop: 8 }}>
        {cargando ? 'Procesando...' : 'Enviar pregunta'}
      </button>
      
      {mensaje && <div style={{ color: 'green', marginTop: 8 }}>✅ {mensaje}</div>}
      {error && <div style={{ color: 'red', marginTop: 8 }}>❌ {error}</div>}
      
      {renderResultado()}
    </form>
  );
};

export default FormularioPregunta; 