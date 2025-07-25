import React, { useState } from 'react';
import { filtrarFilas } from '../services/api';
import TablaResultados from './TablaResultados';

const FiltrarFilas = () => {
  const [condicion, setCondicion] = useState('');
  const [filas, setFilas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [cantidad, setCantidad] = useState(10);
  const [total, setTotal] = useState(null);

  const handleFiltrar = async (e) => {
    e.preventDefault();
    if (cargando) return;
    setFilas([]);
    setError('');
    setExito(false);
    setTotal(null);
    if (!condicion.trim()) {
      setError('Por favor, ingresá una condición de filtro.');
      return;
    }
    setCargando(true);
    try {
      const resp = await filtrarFilas(condicion, cantidad);
      if (resp.ok && Array.isArray(resp.resultado)) {
        setFilas(resp.resultado);
        setExito(true);
        if (resp.total !== undefined) setTotal(resp.total);
      } else {
        setError('❌ ' + (resp.mensaje || 'No se pudo filtrar.'));
      }
    } catch (err) {
      setError('❌ Error de red o el backend no responde.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleFiltrar} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 600 }}>
      <label style={{ fontWeight: 'bold' }}>Condición de filtro</label>
      <input
        type="text"
        value={condicion}
        onChange={e => setCondicion(e.target.value)}
        placeholder="Ej: edad > 30 and ingresos < 50000"
        disabled={cargando}
        style={{ padding: 8 }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <label>Filas a mostrar:
          <select value={cantidad} onChange={e => setCantidad(Number(e.target.value))} disabled={cargando} style={{ marginLeft: 8 }}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>
      </div>
      <button type="submit" disabled={cargando} style={{ marginTop: 8 }}>
        {cargando ? 'Filtrando...' : 'Filtrar'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {exito && <div style={{ color: 'green', marginTop: 8 }}>✅ Filtrado exitoso</div>}
      {total !== null && <div style={{ marginTop: 8 }}>Total de filas filtradas: <b>{total}</b></div>}
      <TablaResultados
        data={filas}
        leyenda="Primeras filas filtradas según la condición"
        numericasConFormato={true}
        mostrarContadores={true}
        copiarHabilitado={true}
      />
    </form>
  );
};

export default FiltrarFilas; 