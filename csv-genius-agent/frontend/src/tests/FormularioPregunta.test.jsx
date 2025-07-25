import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormularioPregunta from '../components/FormularioPregunta';

// Mock del módulo de API
jest.mock('../services/api', () => ({
  enviarPregunta: jest.fn()
}));

describe('FormularioPregunta', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza correctamente el input y botón', () => {
    render(<FormularioPregunta />);
    
    // Verificar que se rendericen los elementos principales
    expect(screen.getByPlaceholderText('Escribe tu pregunta sobre el CSV...')).toBeInTheDocument();
    expect(screen.getByText('Enviar pregunta')).toBeInTheDocument();
    expect(screen.getByText('Modo básico')).toBeInTheDocument();
    expect(screen.getByText('Modo OpenAI')).toBeInTheDocument();
  });

  test('muestra mensaje de error con input vacío', async () => {
    const user = userEvent.setup();
    render(<FormularioPregunta />);
    
    // Hacer clic en el botón sin escribir nada
    const botonEnviar = screen.getByText('Enviar pregunta');
    await user.click(botonEnviar);
    
    // Verificar que aparezca el mensaje de error
    await waitFor(() => {
      expect(screen.getByText('Por favor, escribe una pregunta.')).toBeInTheDocument();
    });
  });

  test('envía pregunta correctamente', async () => {
    const user = userEvent.setup();
    const mockEnviarPregunta = require('../services/api').enviarPregunta;
    mockEnviarPregunta.mockResolvedValue({
      ok: true,
      resultado: {
        accion: 'media',
        columna: 'edad',
        mensaje: 'Calculando media de la columna edad'
      }
    });

    render(<FormularioPregunta />);
    
    // Escribir una pregunta
    const input = screen.getByPlaceholderText('Escribe tu pregunta sobre el CSV...');
    await user.type(input, '¿Cuál es la media de edad?');
    
    // Enviar la pregunta
    const botonEnviar = screen.getByText('Enviar pregunta');
    await user.click(botonEnviar);
    
    // Verificar que se llame a la API
    await waitFor(() => {
      expect(mockEnviarPregunta).toHaveBeenCalledWith('¿Cuál es la media de edad?', 'basico');
    });
    
    // Verificar que se muestre el resultado
    await waitFor(() => {
      expect(screen.getByText('Calculando media de la columna edad')).toBeInTheDocument();
    });
  });

  test('maneja errores de la API', async () => {
    const user = userEvent.setup();
    const mockEnviarPregunta = require('../services/api').enviarPregunta;
    mockEnviarPregunta.mockResolvedValue({
      ok: false,
      mensaje: 'Error al procesar la pregunta'
    });

    render(<FormularioPregunta />);
    
    // Escribir y enviar pregunta
    const input = screen.getByPlaceholderText('Escribe tu pregunta sobre el CSV...');
    await user.type(input, '¿Cuál es la media?');
    
    const botonEnviar = screen.getByText('Enviar pregunta');
    await user.click(botonEnviar);
    
    // Verificar que se muestre el error
    await waitFor(() => {
      expect(screen.getByText('Error al procesar la pregunta')).toBeInTheDocument();
    });
  });

  test('cambia entre modo básico y OpenAI', async () => {
    const user = userEvent.setup();
    render(<FormularioPregunta />);
    
    // Verificar que el modo básico esté seleccionado por defecto
    const modoBasico = screen.getByText('Modo básico');
    const modoOpenAI = screen.getByText('Modo OpenAI');
    
    expect(modoBasico).toHaveStyle({ backgroundColor: '#007bff' });
    expect(modoOpenAI).toHaveStyle({ backgroundColor: 'white' });
    
    // Cambiar a modo OpenAI
    await user.click(modoOpenAI);
    
    // Verificar que el modo OpenAI esté seleccionado
    expect(modoOpenAI).toHaveStyle({ backgroundColor: '#007bff' });
    expect(modoBasico).toHaveStyle({ backgroundColor: 'white' });
  });
}); 