import React, { useState } from 'react';
import { limpiarDatos } from '../services/api';

const LimpiarDatos = () => {
  const [accion, setAccion] = useState('eliminar_filas_con_nulos');
  const [columna, setColumna] = useState('');
  const [valor, setValor] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    let payload = { accion };
    if (accion === 'reemplazar_nulos') {
      if (!columna.trim()) {
        setError('Ingresá el nombre de la columna.');
        return;
      }
      payload.columna = columna;
      payload.valor = valor;
    }
    setCargando(true);
    try {
      const resp = await limpiarDatos(payload);
      if (resp.ok) {
        setMensaje(resp.mensaje || 'Limpieza aplicada correctamente.');
      } else {
        setError(resp.mensaje || 'No se pudo aplicar la limpieza.');
      }
    } catch (err) {
      setError('Error de red o el backend no responde.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
      <label style={{ fontWeight: 'bold' }}>Acción de limpieza</label>
      <select value={accion} onChange={e => setAccion(e.target.value)} disabled={cargando} style={{ padding: 8 }}>
        <option value="eliminar_filas_con_nulos">Eliminar filas con valores nulos</option>
        <option value="reemplazar_nulos">Reemplazar nulos por un valor</option>
        <option value="eliminar_columnas_todos_nulos">Eliminar columnas con todos los nulos</option>
      </select>
      {accion === 'reemplazar_nulos' && (
        <>
          <label>Columna</label>
          <input
            type="text"
            value={columna}
            onChange={e => setColumna(e.target.value)}
            placeholder="Ej: edad"
            disabled={cargando}
            style={{ padding: 8 }}
          />
          <label>Valor para reemplazar nulos</label>
          <input
            type="text"
            value={valor}
            onChange={e => setValor(e.target.value)}
            placeholder="Ej: 0"
            disabled={cargando}
            style={{ padding: 8 }}
          />
        </>
      )}
      <button type="submit" disabled={cargando} style={{ marginTop: 8 }}>
        {cargando ? 'Aplicando...' : 'Aplicar limpieza'}
      </button>
      {mensaje && <div style={{ color: 'green', marginTop: 8 }}>{mensaje}</div>}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </form>
  );
};

export default LimpiarDatos; 