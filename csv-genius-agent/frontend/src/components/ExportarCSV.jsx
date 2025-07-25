import React, { useState } from 'react';
import { exportarCSV } from '../services/api';

function getTimestamp() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

const ExportarCSV = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const handleExportar = async (ext = 'csv') => {
    if (cargando) return;
    setCargando(true);
    setError('');
    setExito(false);
    try {
      const resp = await exportarCSV();
      if (resp.ok && resp.contenido) {
        const blob = new Blob([resp.contenido], { type: ext === 'csv' ? 'text/csv' : 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resultado_${getTimestamp()}.${ext}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setExito(true);
      } else {
        setError(resp.mensaje || 'No se pudo exportar el CSV.');
      }
    } catch (err) {
      setError('Error de red o el backend no responde.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ marginTop: 16 }}>
      <button onClick={() => handleExportar('csv')} disabled={cargando} style={{ padding: '8px 16px', marginRight: 8 }}>
        {cargando ? 'Exportando...' : 'Exportar CSV'}
      </button>
      <button onClick={() => handleExportar('txt')} disabled={cargando} style={{ padding: '8px 16px' }}>
        {cargando ? 'Exportando...' : 'Exportar TXT'}
      </button>
      {exito && <span style={{ color: 'green', marginLeft: 12 }}>✅ Archivo exportado</span>}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default ExportarCSV; 