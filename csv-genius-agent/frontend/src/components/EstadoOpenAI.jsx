import React, { useState, useEffect } from 'react';
import { consultarOpenAI } from '../services/api';

const EstadoOpenAI = () => {
  const [estado, setEstado] = useState('verificando');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    verificarEstadoOpenAI();
  }, []);

  const verificarEstadoOpenAI = async () => {
    try {
      // Hacer una consulta de prueba
      const respuesta = await consultarOpenAI(
        '¿Estás funcionando correctamente?',
        'Este es un test de conectividad.',
        'gpt-3.5-turbo'
      );

      if (respuesta.ok) {
        setEstado('disponible');
        setMensaje('✅ OpenAI está configurado y funcionando correctamente.');
      } else {
        setEstado('error');
        setMensaje(`❌ Error: ${respuesta.mensaje}`);
      }
    } catch (error) {
      setEstado('error');
      setMensaje('❌ No se pudo conectar con el servidor.');
    }
  };

  const getEstiloEstado = () => {
    switch (estado) {
      case 'disponible':
        return {
          background: '#d4edda',
          border: '1px solid #c3e6cb',
          color: '#155724'
        };
      case 'error':
        return {
          background: '#f8d7da',
          border: '1px solid #f5c6cb',
          color: '#721c24'
        };
      default:
        return {
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          color: '#856404'
        };
    }
  };

  return (
    <div style={{
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      marginBottom: '12px',
      ...getEstiloEstado()
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>
          {estado === 'disponible' ? '🤖' : estado === 'error' ? '⚠️' : '⏳'}
        </span>
        <strong>Estado OpenAI:</strong>
        {estado === 'verificando' && 'Verificando...'}
        {estado === 'disponible' && 'Disponible'}
        {estado === 'error' && 'Error'}
      </div>
      {mensaje && (
        <div style={{ marginTop: '4px', fontSize: '11px' }}>
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default EstadoOpenAI; 