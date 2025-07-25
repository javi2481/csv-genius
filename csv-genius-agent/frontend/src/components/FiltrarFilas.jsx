import React, { useState } from 'react';
import { filtrarFilas, exportarFiltrado } from '../services/api';
import TablaResultados from './TablaResultados';
import InputConEtiqueta from './InputConEtiqueta';
import SelectorCantidadFilas from './SelectorCantidadFilas';
import BotonConEstado from './BotonConEstado';
import MensajeFeedback from './MensajeFeedback';
import { estilosGenerales } from '../styles/estilosGenerales';

function getTimestamp() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

const FiltrarFilas = () => {
  const [condicion, setCondicion] = useState('');
  const [filas, setFilas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cantidad, setCantidad] = useState(10);
  const [total, setTotal] = useState(null);

  const handleFiltrar = async (e) => {
    e.preventDefault();
    if (cargando) return;
    setFilas([]);
    setError('');
    setExito('');
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
        setExito('Filtrado exitoso');
        if (resp.total !== undefined) setTotal(resp.total);
      } else {
        setError(resp.mensaje || 'No se pudo filtrar.');
      }
    } catch (err) {
      setError('Error de red o el backend no responde.');
    } finally {
      setCargando(false);
    }
  };

  const handleExportarFiltrado = async () => {
    if (exportando || filas.length === 0) return;
    setExportando(true);
    setError('');
    setExito('');
    try {
      const resp = await exportarFiltrado(condicion, cantidad);
      if (resp.ok && resp.contenido) {
        const blob = new Blob([resp.contenido], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resultado_filtrado_${getTimestamp()}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setExito('Archivo exportado');
        setTimeout(() => setExito(''), 2000);
      } else {
        setError(resp.mensaje || 'No se pudo exportar el filtrado.');
      }
    } catch (err) {
      setError('Error de red al exportar.');
    } finally {
      setExportando(false);
    }
  };

  return (
    <form onSubmit={handleFiltrar} style={estilosGenerales.contenedor}>
      <InputConEtiqueta
        etiqueta="Condición de filtro"
        valor={condicion}
        onChange={e => setCondicion(e.target.value)}
        placeholder="Ej: edad > 30 and ingresos < 50000"
        deshabilitado={cargando}
        required
      />
      <SelectorCantidadFilas
        valor={cantidad}
        onChange={e => setCantidad(Number(e.target.value))}
        deshabilitado={cargando}
      />
      <BotonConEstado
        tipo="submit"
        texto="Filtrar"
        textoCargando="Filtrando..."
        cargando={cargando}
      />
      <MensajeFeedback tipo="error" mensaje={error} />
      <MensajeFeedback tipo="exito" mensaje={exito} />
      {total !== null && (
        <div style={estilosGenerales.mensajeInfo}>
          Total de filas filtradas: <b>{total}</b>
        </div>
      )}
      <TablaResultados
        data={filas}
        leyenda="Primeras filas filtradas según la condición"
        numericasConFormato={true}
        mostrarContadores={true}
        copiarHabilitado={true}
      />
      <BotonConEstado
        texto="Exportar resultados filtrados (.csv)"
        textoCargando="Exportando..."
        cargando={exportando}
        deshabilitado={filas.length === 0}
        onClick={handleExportarFiltrado}
        secundario
      />
    </form>
  );
};

export default FiltrarFilas; 