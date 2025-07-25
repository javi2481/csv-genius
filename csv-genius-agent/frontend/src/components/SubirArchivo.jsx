// SubirArchivo.jsx
// Componente para subir un archivo CSV al backend y mostrar mensajes de estado.

import React, { useState } from 'react';
import { subirCSV } from '../services/api';

const SubirArchivo = ({ onUploadSuccess }) => {
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setArchivo(e.target.files[0]);
    setMensaje('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    if (!archivo) {
      setError('Por favor, seleccioná un archivo CSV.');
      return;
    }
    if (!archivo.name.endsWith('.csv')) {
      setError('El archivo debe tener extensión .csv');
      return;
    }
    setCargando(true);
    try {
      const respuesta = await subirCSV(archivo);
      if (respuesta.ok) {
        setMensaje(respuesta.mensaje || 'Archivo subido correctamente.');
        setArchivo(null);
        if (onUploadSuccess) onUploadSuccess();
      } else {
        setError(respuesta.mensaje || 'Error al subir el archivo.');
      }
    } catch (err) {
      setError('Error de conexión con el backend.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="subir-archivo-form" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label style={{ fontWeight: 'bold', marginBottom: 4 }}>Subir archivo CSV</label>
      <input
        type="file"
        accept=".csv"
        onChange={handleChange}
        disabled={cargando}
      />
      <button type="submit" disabled={cargando} style={{ marginTop: 8 }}>
        {cargando ? 'Subiendo...' : 'Subir Archivo'}
      </button>
      {mensaje && <div style={{ color: 'green', marginTop: 8 }}>{mensaje}</div>}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </form>
  );
};

export default SubirArchivo; 