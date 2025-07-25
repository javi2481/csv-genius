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
        setMensaje(resp.mensaje || 'Pregunta interpretada correctamente.');
      } else {
        setError(resp.mensaje || 'No se pudo interpretar la pregunta.');
      }
    } catch (err) {
      setError('Error de red o el backend no responde.');
    } finally {
      setCargando(false);
    }
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
          Modo básico
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
          Modo OpenAI
        </label>
      </div>
      <button type="submit" disabled={cargando} style={{ marginTop: 8 }}>
        {cargando ? 'Enviando...' : 'Enviar pregunta'}
      </button>
      {mensaje && <div style={{ color: 'green', marginTop: 8 }}>{mensaje}</div>}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {resultado && (
        <div style={{ marginTop: 16, background: '#f8f8f8', padding: 12, borderRadius: 6 }}>
          <div><b>Acción:</b> {resultado.accion}</div>
          <div><b>Columna:</b> {resultado.columna || 'N/A'}</div>
          <div><b>Mensaje:</b> {resultado.mensaje}</div>
        </div>
      )}
    </form>
  );
};

export default FormularioPregunta; 