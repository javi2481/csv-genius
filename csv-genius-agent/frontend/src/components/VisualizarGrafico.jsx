import React, { useState } from 'react';
import { graficar, getImageUrl } from '../services/api';
import { estilosGenerales } from '../styles/estilosGenerales';

const VisualizarGrafico = () => {
  const [columna, setColumna] = useState('');
  const [tipo, setTipo] = useState('histograma');
  const [imgSrc, setImgSrc] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const resetearEstados = () => {
    setMensaje('');
    setError('');
    setImgSrc('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetearEstados();
    
    if (!columna.trim()) {
      setError('Por favor, escribí el nombre de la columna.');
      return;
    }

    setCargando(true);
    try {
      const resp = await graficar(tipo, columna);
      if (resp.ok && resp.resultado && resp.resultado.ruta) {
        const imageUrl = getImageUrl(resp.resultado.ruta);
        setImgSrc(imageUrl);
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
    <div style={estilosGenerales.contenedor}>
      <h2 style={{ marginBottom: 20, color: '#2c3e50' }}>Visualizar gráfico</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={estilosGenerales.label}>
            Columna a graficar
          </label>
          <input
            type="text"
            value={columna}
            onChange={e => setColumna(e.target.value)}
            placeholder="Ej: edad, ingresos, ciudad"
            disabled={cargando}
            style={estilosGenerales.input}
          />
        </div>
        
        <div>
          <label style={estilosGenerales.label}>Tipo de gráfico</label>
          <div style={estilosGenerales.grupoControles}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="radio"
                name="tipo"
                value="histograma"
                checked={tipo === 'histograma'}
                onChange={() => setTipo('histograma')}
                disabled={cargando}
              />
              📊 Histograma (datos numéricos)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="radio"
                name="tipo"
                value="barras"
                checked={tipo === 'barras'}
                onChange={() => setTipo('barras')}
                disabled={cargando}
              />
              📈 Barras (datos categóricos)
            </label>
          </div>
        </div>

        <div style={{
          background: tipo === 'histograma' ? '#e3f2fd' : '#fff3e0',
          padding: 12,
          borderRadius: 6,
          fontSize: 14,
          border: `1px solid ${tipo === 'histograma' ? '#2196f3' : '#ff9800'}`
        }}>
          {tipo === 'histograma' ? (
            <>
              <strong>📊 Histograma:</strong> Ideal para mostrar la distribución de datos numéricos continuos.
              Muestra la frecuencia de valores en diferentes rangos.
            </>
          ) : (
            <>
              <strong>📈 Gráfico de barras:</strong> Perfecto para comparar categorías o valores discretos.
              Muestra la frecuencia de cada categoría.
            </>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={cargando || !columna.trim()} 
          style={getEstiloBoton(cargando || !columna.trim())}
        >
          {cargando ? '⏳ Generando...' : ' Generar gráfico'}
        </button>
        
        {mensaje && (
          <div style={estilosGenerales.mensajeExito}>
            ✅ {mensaje}
          </div>
        )}
        {error && (
          <div style={estilosGenerales.mensajeError}>
            ❌ {error}
          </div>
        )}
        
        {imgSrc && (
          <div style={{ marginTop: 20 }}>
            <h3 style={{ marginBottom: 12, color: '#2c3e50' }}>Gráfico generado</h3>
            <div style={{
              border: '1px solid #dee2e6',
              borderRadius: 8,
              padding: 16,
              background: 'white',
              textAlign: 'center'
            }}>
              <img 
                src={imgSrc} 
                alt="Gráfico generado" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '500px',
                  borderRadius: 4
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  setError('No se pudo cargar la imagen del gráfico. Verifica que el backend esté generando las imágenes correctamente.');
                }}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default VisualizarGrafico; 