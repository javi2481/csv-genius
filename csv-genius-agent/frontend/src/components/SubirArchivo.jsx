// SubirArchivoMejorado.jsx
// Componente mejorado para subir archivos CSV con barra de progreso

import React, { useState, useRef } from 'react';
import { debugSubirCSV } from '../services/api';
import { estilosGenerales, getEstiloBoton } from '../styles/estilosGenerales';

const SubirArchivoMejorado = ({ onUploadSuccess }) => {
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [archivoInfo, setArchivoInfo] = useState(null);
  const fileInputRef = useRef(null);

  const resetearEstados = () => {
    setMensaje('');
    setError('');
    setArchivoInfo(null);
    setProgreso(0);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    resetearEstados();
    
    if (!file) {
      setArchivo(null);
      return;
    }

    // Validar tipo de archivo
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('El archivo debe tener extensión .csv');
      setArchivo(null);
      return;
    }

    // Validar tamaño (máximo 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      setError(`El archivo es demasiado grande. Máximo 100MB permitido. Tamaño actual: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      setArchivo(null);
      return;
    }

    setArchivo(file);
    setArchivoInfo({
      nombre: file.name,
      tamaño: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      fecha: new Date(file.lastModified).toLocaleDateString()
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetearEstados();
    
    if (!archivo) {
      setError('Por favor, seleccioná un archivo CSV.');
      return;
    }

    setCargando(true);
    setProgreso(10); // Inicio

    try {
      console.log('Iniciando subida de archivo...'); // Debug
      setProgreso(20); // Preparando
      
      const respuesta = await debugSubirCSV(archivo); // Usar función de debug
      setProgreso(90); // Casi terminado
      
      console.log('Respuesta recibida:', respuesta); // Debug
      
      if (respuesta.ok) {
        setProgreso(100); // Completado
        setMensaje(respuesta.mensaje || 'Archivo subido correctamente.');
        if (respuesta.filas && respuesta.columnas) {
          setMensaje(prev => `${prev} El archivo contiene ${respuesta.filas} filas y ${respuesta.columnas} columnas.`);
        }
        if (respuesta.tiempo_procesamiento) {
          setMensaje(prev => `${prev} Tiempo de procesamiento: ${respuesta.tiempo_procesamiento.toFixed(2)} segundos.`);
        }
        setArchivo(null);
        setArchivoInfo(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        if (onUploadSuccess) onUploadSuccess();
      } else {
        setError(respuesta.mensaje || 'Error al subir el archivo.');
      }
    } catch (err) {
      console.error('Error completo:', err); // Debug
      setError(`Error de conexión con el backend: ${err.message}`);
    } finally {
      setCargando(false);
      // Resetear progreso después de un momento
      setTimeout(() => setProgreso(0), 2000);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#007bff';
    e.currentTarget.style.backgroundColor = '#f8f9fa';
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#dee2e6';
    e.currentTarget.style.backgroundColor = 'white';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#dee2e6';
    e.currentTarget.style.backgroundColor = 'white';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const event = { target: { files: [file] } };
      handleChange(event);
    }
  };

  return (
    <div style={estilosGenerales.contenedor}>
      <h2 style={{ marginBottom: 20, color: '#2c3e50' }}>Subir archivo CSV</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={estilosGenerales.label}>
            Seleccionar archivo CSV
          </label>
          <div
            style={{
              border: '2px dashed #dee2e6',
              borderRadius: 8,
              padding: 20,
              textAlign: 'center',
              backgroundColor: 'white',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleChange}
              disabled={cargando}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: 48, marginBottom: 12 }}>📁</div>
            <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
              {archivo ? archivo.name : 'Haz clic o arrastra un archivo CSV aquí'}
            </div>
            <div style={{ fontSize: 14, color: '#6c757d' }}>
              Máximo 100MB • Solo archivos .csv
            </div>
          </div>
        </div>

        {archivoInfo && (
          <div style={{
            background: '#e9ecef',
            padding: 12,
            borderRadius: 6,
            fontSize: 14
          }}>
            <div><strong>Archivo seleccionado:</strong> {archivoInfo.nombre}</div>
            <div><strong>Tamaño:</strong> {archivoInfo.tamaño}</div>
            <div><strong>Fecha:</strong> {archivoInfo.fecha}</div>
          </div>
        )}

        {/* Barra de progreso */}
        {cargando && (
          <div style={{ marginTop: 8 }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: 4,
              fontSize: 12,
              color: '#666'
            }}>
              <span>Progreso</span>
              <span>{progreso}%</span>
            </div>
            <div style={{
              width: '100%',
              height: 8,
              backgroundColor: '#e9ecef',
              borderRadius: 4,
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progreso}%`,
                height: '100%',
                backgroundColor: '#007bff',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ 
              fontSize: 11, 
              color: '#666', 
              marginTop: 4,
              textAlign: 'center'
            }}>
              {progreso < 20 && 'Preparando archivo...'}
              {progreso >= 20 && progreso < 90 && 'Subiendo y procesando...'}
              {progreso >= 90 && 'Finalizando...'}
            </div>
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={cargando || !archivo} 
          style={getEstiloBoton(cargando || !archivo)}
        >
          {cargando ? '⏳ Subiendo...' : '📤 Subir Archivo'}
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
      </form>
    </div>
  );
};

export default SubirArchivoMejorado; 