import React, { useState } from 'react';
import { compararColumnas } from '../services/api';
import TablaResultados from './TablaResultados';

const CompararColumnas = () => {
  const [col1, setCol1] = useState('');
  const [col2, setCol2] = useState('');
  const [comparacion, setComparacion] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const handleComparar = async (e) => {
    e.preventDefault();
    if (cargando) return;
    setComparacion(null);
    setError('');
    setExito(false);
    if (!col1.trim() || !col2.trim()) {
      setError('Por favor, ingresá ambos nombres de columna.');
      return;
    }
    if (col1.trim() === col2.trim()) {
      setError('❌ No se puede comparar una columna consigo misma.');
      return;
    }
    setCargando(true);
    try {
      const resp = await compararColumnas(col1, col2);
      if (resp.ok && resp.comparacion) {
        setComparacion([{ ...resp.comparacion }]);
        setExito(true);
      } else {
        setError('❌ ' + (resp.mensaje || 'No se pudo obtener la comparación.'));
      }
    } catch (err) {
      setError('❌ Error de red o el backend no responde.');
    } finally {
      setCargando(false);
    }
  };

  // Placeholder para datalist de columnas (si se obtiene la lista de columnas, reemplazar)
  // const columnasEjemplo = ['edad', 'ingresos', 'sexo'];

  return (
    <form onSubmit={handleComparar} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
      <label style={{ fontWeight: 'bold' }}>Primera columna</label>
      <input
        type="text"
        value={col1}
        onChange={e => setCol1(e.target.value)}
        placeholder="Ej: edad"
        disabled={cargando}
        style={{ padding: 8 }}
        // list="columnas"
      />
      <label style={{ fontWeight: 'bold' }}>Segunda columna</label>
      <input
        type="text"
        value={col2}
        onChange={e => setCol2(e.target.value)}
        placeholder="Ej: ingresos"
        disabled={cargando}
        style={{ padding: 8 }}
        // list="columnas"
      />
      {/* <datalist id="columnas">
        {columnasEjemplo.map(col => <option key={col} value={col} />)}
      </datalist> */}
      <button type="submit" disabled={cargando} style={{ marginTop: 8 }}>
        {cargando ? 'Comparando...' : 'Comparar'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {exito && <div style={{ color: 'green', marginTop: 8 }}>✅ Comparación exitosa</div>}
      {comparacion && (
        <TablaResultados
          data={comparacion}
          leyenda={`Comparación entre "${col1}" y "${col2}"`}
          numericasConFormato={true}
          mostrarContadores={true}
          copiarHabilitado={true}
          coloresCondicionales={{ correlacion: v => v > 0.7 ? 'lightblue' : '' }}
          claveEspecialResaltada="correlacion"
        />
      )}
    </form>
  );
};

export default CompararColumnas; 