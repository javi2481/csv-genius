import React, { useRef, useEffect, useState } from 'react';

const estilosTabla = {
  wrapper: {
    overflowX: 'auto',
    marginTop: 12,
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    background: '#fff',
    animation: 'fadeIn 0.7s',
  },
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    minWidth: 320,
    fontSize: 15,
    background: '#fff',
  },
  th: {
    background: '#f5f5f5',
    border: '1px solid #e0e0e0',
    padding: 8,
    textAlign: 'left',
    textTransform: 'capitalize',
    fontWeight: 700,
  },
  td: {
    border: '1px solid #e0e0e0',
    padding: 8,
    textTransform: 'capitalize',
    background: '#fff',
    transition: 'background 0.3s',
  },
  leyenda: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
    marginTop: 8,
  },
  contadores: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  copiarBtn: {
    marginLeft: 8,
    fontSize: 15,
    cursor: 'pointer',
    background: '#f0f0f0',
    border: 'none',
    borderRadius: 4,
    padding: '2px 8px',
    transition: 'background 0.2s',
  },
  fadeIn: {
    animation: 'fadeIn 0.7s',
  },
  vacia: {
    color: '#b00',
    fontWeight: 500,
    margin: '16px 0',
    textAlign: 'center',
  },
};

const TablaResultados = ({
  data = [],
  leyenda = '',
  coloresCondicionales = {},
  numericasConFormato = true,
  mostrarContadores = true,
  copiarHabilitado = true,
  claveEspecialResaltada = '',
}) => {
  const tablaRef = useRef();
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (copiado) {
      const timer = setTimeout(() => setCopiado(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [copiado]);

  if (!data || data.length === 0) {
    return <div style={estilosTabla.vacia}>⚠️ No se encontraron filas para mostrar</div>;
  }

  const columnas = Object.keys(data[0]);

  const copiarTabla = () => {
    if (!tablaRef.current) return;
    let texto = columnas.join('\t') + '\n';
    data.forEach(fila => {
      texto += columnas.map(col => fila[col]).join('\t') + '\n';
    });
    navigator.clipboard.writeText(texto);
    setCopiado(true);
  };

  // Animación fade-in (CSS-in-JS)
  useEffect(() => {
    if (tablaRef.current) {
      tablaRef.current.style.opacity = 0;
      setTimeout(() => {
        if (tablaRef.current) tablaRef.current.style.opacity = 1;
      }, 50);
    }
  }, [data]);

  return (
    <div style={estilosTabla.wrapper}>
      {leyenda && <div style={estilosTabla.leyenda}>{leyenda}</div>}
      {mostrarContadores && (
        <div style={estilosTabla.contadores}>
          {data.length} filas, {columnas.length} columnas
        </div>
      )}
      {copiarHabilitado && (
        <button type="button" style={estilosTabla.copiarBtn} onClick={copiarTabla} title="Copiar tabla">
          📋 Copiar {copiado && <span style={{ color: 'green', marginLeft: 4 }}>✅</span>}
        </button>
      )}
      <div style={{ overflowX: 'auto', transition: 'box-shadow 0.3s' }}>
        <table ref={tablaRef} style={{ ...estilosTabla.table, opacity: 1, transition: 'opacity 0.7s' }}>
          <thead>
            <tr>
              {columnas.map(col => (
                <th key={col} style={estilosTabla.th}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((fila, idx) => (
              <tr key={idx}>
                {columnas.map(col => {
                  let valor = fila[col];
                  let style = { ...estilosTabla.td };
                  // Formato numérico regional
                  if (numericasConFormato && typeof valor === 'number' && !isNaN(valor)) {
                    valor = valor.toLocaleString('es-AR');
                  }
                  // Colores condicionales
                  if (coloresCondicionales[col]) {
                    const color = coloresCondicionales[col](fila[col]);
                    if (color) style.background = color;
                  }
                  // Resaltado especial
                  if (claveEspecialResaltada && (col === claveEspecialResaltada || fila[claveEspecialResaltada])) {
                    style.fontWeight = 700;
                  }
                  return (
                    <td key={col} style={style}>{valor}</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default TablaResultados; 