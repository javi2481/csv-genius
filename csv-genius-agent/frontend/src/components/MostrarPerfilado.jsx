import React, { useEffect, useState } from 'react';
import { obtenerResumen } from '../services/api';
import TablaResultados from './TablaResultados';

const MostrarPerfilado = () => {
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  useEffect(() => {
    const fetchResumen = async () => {
      setCargando(true);
      setError('');
      setExito(false);
      try {
        const resp = await obtenerResumen();
        if (resp.ok) {
          setResumen(resp.resumen);
          setExito(true);
        } else {
          setError('❌ ' + (resp.mensaje || 'No se pudo obtener el resumen.'));
        }
      } catch (err) {
        setError('❌ Error de red o el backend no responde.');
      } finally {
        setCargando(false);
      }
    };
    fetchResumen();
  }, []);

  if (cargando) return <div>Cargando resumen del CSV...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!resumen) return null;

  // Preparar datos para tablas reutilizables
  const faltantesData = Object.entries(resumen.faltantes || {}).map(([col, val]) => ({ columna: col, nulos: val }));
  const estadisticasData = resumen.estadisticas ? Object.entries(resumen.estadisticas).map(([col, stats]) => ({ columna: col, ...stats })) : [];

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Resumen del CSV</h3>
      {exito && <div style={{ color: 'green', marginBottom: 8 }}>✅ Resumen obtenido correctamente</div>}
      <div><b>Total de filas:</b> {resumen.filas}</div>
      <div><b>Total de columnas:</b> {resumen.columnas}</div>
      <TablaResultados
        data={resumen.numericas.map(col => ({ columna: col }))}
        leyenda="Columnas numéricas"
        mostrarContadores={false}
        copiarHabilitado={false}
      />
      <TablaResultados
        data={resumen.categoricas.map(col => ({ columna: col }))}
        leyenda="Columnas categóricas"
        mostrarContadores={false}
        copiarHabilitado={false}
      />
      <TablaResultados
        data={faltantesData}
        leyenda="Valores faltantes por columna"
        coloresCondicionales={{ nulos: v => v > 0 ? '#ffe5e5' : '' }}
        numericasConFormato={true}
        mostrarContadores={true}
        copiarHabilitado={true}
      />
      <TablaResultados
        data={estadisticasData}
        leyenda="Estadísticas por columna numérica"
        numericasConFormato={true}
        mostrarContadores={true}
        copiarHabilitado={true}
      />
    </div>
  );
};

export default MostrarPerfilado; 