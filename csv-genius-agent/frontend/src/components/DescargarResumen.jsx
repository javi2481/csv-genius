import React, { useState } from 'react';
import { obtenerResumen } from '../services/api';

function getTimestamp() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

const DescargarResumen = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const handleDescargar = async (ext = 'json') => {
    if (cargando) return;
    setCargando(true);
    setError('');
    setExito(false);
    try {
      const resp = await obtenerResumen();
      if (resp.ok && resp.resumen) {
        let contenido, type;
        if (ext === 'json') {
          contenido = JSON.stringify(resp.resumen, null, 2);
          type = 'application/json';
        } else {
          contenido = Object.entries(resp.resumen).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n');
          type = 'text/plain';
        }
        const blob = new Blob([contenido], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resumen.csv-genius-agent_${getTimestamp()}.${ext}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setExito(true);
      } else {
        setError(resp.mensaje || 'No se pudo obtener el resumen.');
      }
    } catch (err) {
      setError('Error de red o el backend no responde.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ marginTop: 16 }}>
      <button onClick={() => handleDescargar('json')} disabled={cargando} style={{ padding: '8px 16px', marginRight: 8 }}>
        {cargando ? 'Descargando...' : 'Descargar resumen (.json)'}
      </button>
      <button onClick={() => handleDescargar('txt')} disabled={cargando} style={{ padding: '8px 16px' }}>
        {cargando ? 'Descargando...' : 'Descargar resumen (.txt)'}
      </button>
      {exito && <span style={{ color: 'green', marginLeft: 12 }}>✅ Archivo exportado</span>}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default DescargarResumen; 