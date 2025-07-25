import React, { useState } from 'react';
import { graficar } from '../services/api';

const VisualizarGrafico = () => {
  const [columna, setColumna] = useState('');
  const [tipo, setTipo] = useState('histograma');
  const [imgSrc, setImgSrc] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    setImgSrc('');
    if (!columna.trim()) {
      setError('Por favor, escribí el nombre de la columna.');
      return;
    }
    setCargando(true);
    try {
      const resp = await graficar(columna, tipo);
      if (resp.ok && resp.resultado && resp.resultado.ruta) {
        setImgSrc(resp.resultado.ruta);
        setMensaje(resp.mensaje || 'Gráfico generado correctamente.');
      } else {
        setError(resp.mensaje || 'No se pudo generar el gráfico.');
      }
    } catch (err) {
      setError('Error de red o el backend no responde.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label style={{ fontWeight: 'bold' }}>Columna a graficar</label>
      <input
        type="text"
        value={columna}
        onChange={e => setColumna(e.target.value)}
        placeholder="Ej: edad"
        disabled={cargando}
        style={{ padding: 8 }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <label>
          <input
            type="radio"
            name="tipo"
            value="histograma"
            checked={tipo === 'histograma'}
            onChange={() => setTipo('histograma')}
            disabled={cargando}
          />{' '}
          Histograma
        </label>
        <label>
          <input
            type="radio"
            name="tipo"
            value="barras"
            checked={tipo === 'barras'}
            onChange={() => setTipo('barras')}
            disabled={cargando}
          />{' '}
          Barras
        </label>
      </div>
      <button type="submit" disabled={cargando} style={{ marginTop: 8 }}>
        {cargando ? 'Generando...' : 'Generar gráfico'}
      </button>
      {mensaje && <div style={{ color: 'green', marginTop: 8 }}>{mensaje}</div>}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {imgSrc && (
        <div style={{ marginTop: 16 }}>
          <img src={imgSrc} alt="Gráfico generado" style={{ maxWidth: '100%', border: '1px solid #ccc', borderRadius: 6 }} />
        </div>
      )}
    </form>
  );
};

export default VisualizarGrafico; 