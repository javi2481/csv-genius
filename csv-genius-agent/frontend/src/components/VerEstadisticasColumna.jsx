import React, { useState } from 'react';
import { estadisticasColumna } from '../services/api';
import TablaResultados from './TablaResultados';

const VerEstadisticasColumna = () => {
  const [columna, setColumna] = useState('');
  const [estadisticas, setEstadisticas] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const handleConsultar = async (e) => {
    e.preventDefault();
    if (cargando) return;
    setEstadisticas(null);
    setError('');
    setExito(false);
    if (!columna.trim()) {
      setError('Por favor, ingresá el nombre de la columna.');
      return;
    }
    setCargando(true);
    try {
      const resp = await estadisticasColumna(columna);
      if (resp.ok && resp.estadisticas) {
        setEstadisticas([{ ...resp.estadisticas }]);
        setExito(true);
      } else {
        setError('❌ ' + (resp.mensaje || 'No se pudo obtener la información.'));
      }
    } catch (err) {
      setError('❌ Error de red o el backend no responde.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleConsultar} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
      <label style={{ fontWeight: 'bold' }}>Nombre de la columna</label>
      <input
        type="text"
        value={columna}
        onChange={e => setColumna(e.target.value)}
        placeholder="Ej: edad"
        disabled={cargando}
        style={{ padding: 8 }}
      />
      <button type="submit" disabled={cargando} style={{ marginTop: 8 }}>
        {cargando ? 'Consultando...' : 'Consultar'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {exito && <div style={{ color: 'green', marginTop: 8 }}>✅ Estadísticas obtenidas</div>}
      {estadisticas && (
        <TablaResultados
          data={estadisticas}
          leyenda={`Estadísticas de la columna "${columna}"`}
          numericasConFormato={true}
          mostrarContadores={true}
          copiarHabilitado={true}
        />
      )}
    </form>
  );
};

export default VerEstadisticasColumna; 