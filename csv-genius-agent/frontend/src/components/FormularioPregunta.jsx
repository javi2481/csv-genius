// FormularioPregunta.jsx
// Permite al usuario escribir una pregunta sobre el CSV y elegir el modo de interpretación.

import React, { useState } from 'react';
import { enviarPregunta } from '../services/api';
import { estilosGenerales } from '../styles/estilosGenerales';

const FormularioPregunta = () => {
  const [pregunta, setPregunta] = useState('');
  const [modo, setModo] = useState('basico');
  const [resultado, setResultado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const resetearEstados = () => {
    setMensaje('');
    setError('');
    setResultado(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetearEstados();
    
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
      <div style={{ 
        marginTop: 16, 
        background: '#f8f9fa', 
        padding: 16, 
        borderRadius: 8,
        border: '1px solid #e9ecef'
      }}>
        {modo === 'openai' ? (
          // Resultado para modo OpenAI
          <div>
            <div style={{ marginBottom: 12 }}>
              <span style={{ 
                background: '#007bff', 
                color: 'white', 
                padding: '4px 12px', 
                borderRadius: 16, 
                fontSize: 12,
                fontWeight: 'bold'
              }}>
                🤖 OpenAI
              </span>
            </div>
            {resultado.valor !== undefined ? (
              // Resultado numérico (ej: media)
              <div>
                <div style={{ marginBottom: 8 }}>
                  <strong>Resultado:</strong> {typeof resultado.valor === 'number' ? resultado.valor.toFixed(2) : resultado.valor}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <strong>Columna:</strong> {resultado.columna}
                </div>
                <div>
                  <strong>Descripción:</strong> {resultado.mensaje}
                </div>
              </div>
            ) : resultado.ruta ? (
              // Resultado de gráfico
              <div>
                <div style={{ marginBottom: 8 }}>
                  <strong>Gráfico generado:</strong>
                </div>
                <img 
                  src={resultado.ruta} 
                  alt="Gráfico generado" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '400px',
                    border: '1px solid #dee2e6',
                    borderRadius: 4,
                    marginBottom: 8
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    setError('No se pudo cargar la imagen del gráfico');
                  }}
                />
                <div>
                  <strong>Descripción:</strong> {resultado.mensaje}
                </div>
              </div>
            ) : (
              // Resultado general
              <div>
                <div style={{ marginBottom: 8 }}>
                  <strong>Acción interpretada:</strong> {resultado.accion}
                </div>
                {resultado.columna && (
                  <div style={{ marginBottom: 8 }}>
                    <strong>Columna:</strong> {resultado.columna}
                  </div>
                )}
                <div>
                  <strong>Respuesta:</strong> {resultado.mensaje}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Resultado para modo básico
          <div>
            <div style={{ marginBottom: 12 }}>
              <span style={{ 
                background: '#28a745', 
                color: 'white', 
                padding: '4px 12px', 
                borderRadius: 16, 
                fontSize: 12,
                fontWeight: 'bold'
              }}>
                🔍 Básico
              </span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Acción:</strong> {resultado.accion}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Columna:</strong> {resultado.columna || 'N/A'}
            </div>
            <div>
              <strong>Mensaje:</strong> {resultado.mensaje}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={estilosGenerales.contenedor}>
      <h2 style={{ marginBottom: 20, color: '#2c3e50' }}>Preguntar sobre el CSV</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={estilosGenerales.label}>
            Pregunta sobre el CSV
          </label>
          <textarea
            value={pregunta}
            onChange={e => setPregunta(e.target.value)}
            placeholder="Ej: ¿Cuál es la media de la columna edad? ¿Cuántos valores nulos hay en la columna ingresos?"
            disabled={cargando}
            style={{
              ...estilosGenerales.input,
              minHeight: '80px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        </div>
        
        <div>
          <label style={estilosGenerales.label}>Modo de interpretación</label>
          <div style={estilosGenerales.grupoControles}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="radio"
                name="modo"
                value="basico"
                checked={modo === 'basico'}
                onChange={() => setModo('basico')}
                disabled={cargando}
              />
              <span style={{ color: '#28a745', fontWeight: 'bold' }}>🔍 Modo básico</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="radio"
                name="modo"
                value="openai"
                checked={modo === 'openai'}
                onChange={() => setModo('openai')}
                disabled={cargando}
              />
              <span style={{ color: '#007bff', fontWeight: 'bold' }}>🤖 Modo OpenAI</span>
            </label>
          </div>
        </div>
        
        <div style={{ 
          background: modo === 'openai' ? '#e3f2fd' : '#f1f8e9', 
          padding: 12, 
          borderRadius: 6, 
          fontSize: 14,
          border: `1px solid ${modo === 'openai' ? '#2196f3' : '#4caf50'}`
        }}>
          {modo === 'openai' ? (
            <>
              <strong>🤖 Modo OpenAI:</strong> Usa inteligencia artificial para interpretar preguntas complejas 
              y generar respuestas más naturales. Requiere conexión a internet y API key configurada.
            </>
          ) : (
            <>
              <strong>🔍 Modo básico:</strong> Usa palabras clave para interpretar preguntas simples. 
              Funciona sin conexión a internet.
            </>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={cargando || !pregunta.trim()} 
          style={estilosGenerales.boton}
        >
          {cargando ? '⏳ Procesando...' : '🚀 Enviar pregunta'}
        </button>
        
        {mensaje && (
          <div style={estilosGenerales.mensajeExito}>
            ✅ {mensaje}
          </div>
        )}
        {error && (
          <div style={estilosGenerales.mensajeError}>
            ❌ {error}
          </div>
        )}
        
        {renderResultado()}
      </form>
    </div>
  );
};

export default FormularioPregunta; 