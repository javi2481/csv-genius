import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VisualizarGrafico from '../components/VisualizarGrafico';

// Mock del módulo de API
jest.mock('../services/api', () => ({
  graficar: jest.fn()
}));

describe('VisualizarGrafico', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza correctamente los inputs y botones', () => {
    render(<VisualizarGrafico />);
    
    // Verificar que se rendericen los elementos principales
    expect(screen.getByPlaceholderText('Nombre de la columna')).toBeInTheDocument();
    expect(screen.getByText('Generar gráfico')).toBeInTheDocument();
    expect(screen.getByText('histograma')).toBeInTheDocument();
    expect(screen.getByText('barras')).toBeInTheDocument();
  });

  test('simula ingreso de columna y selección de gráfico', async () => {
    const user = userEvent.setup();
    render(<VisualizarGrafico />);
    
    // Escribir nombre de columna
    const inputColumna = screen.getByPlaceholderText('Nombre de la columna');
    await user.type(inputColumna, 'edad');
    
    // Verificar que el valor se haya establecido
    expect(inputColumna).toHaveValue('edad');
    
    // Cambiar tipo de gráfico a barras
    const selectGrafico = screen.getByDisplayValue('histograma');
    await user.selectOptions(selectGrafico, 'barras');
    
    // Verificar que se haya cambiado
    expect(selectGrafico).toHaveValue('barras');
  });

  test('muestra error con respuesta falsa de API', async () => {
    const user = userEvent.setup();
    const mockGraficar = require('../services/api').graficar;
    mockGraficar.mockResolvedValue({
      ok: false,
      mensaje: 'La columna no existe en el CSV'
    });

    render(<VisualizarGrafico />);
    
    // Escribir columna y generar gráfico
    const inputColumna = screen.getByPlaceholderText('Nombre de la columna');
    await user.type(inputColumna, 'columna_inexistente');
    
    const botonGenerar = screen.getByText('Generar gráfico');
    await user.click(botonGenerar);
    
    // Verificar que se muestre el error
    await waitFor(() => {
      expect(screen.getByText('La columna no existe en el CSV')).toBeInTheDocument();
    });
  });

  test('genera gráfico exitosamente', async () => {
    const user = userEvent.setup();
    const mockGraficar = require('../services/api').graficar;
    mockGraficar.mockResolvedValue({
      ok: true,
      resultado: {
        ruta: '/static/charts/hist_edad_20250125.png'
      },
      mensaje: 'Gráfico generado correctamente'
    });

    render(<VisualizarGrafico />);
    
    // Escribir columna y generar gráfico
    const inputColumna = screen.getByPlaceholderText('Nombre de la columna');
    await user.type(inputColumna, 'edad');
    
    const botonGenerar = screen.getByText('Generar gráfico');
    await user.click(botonGenerar);
    
    // Verificar que se llame a la API con los parámetros correctos
    await waitFor(() => {
      expect(mockGraficar).toHaveBeenCalledWith('histograma', 'edad');
    });
    
    // Verificar que se muestre el mensaje de éxito
    await waitFor(() => {
      expect(screen.getByText('Gráfico generado correctamente')).toBeInTheDocument();
    });
    
    // Verificar que se muestre la imagen
    await waitFor(() => {
      const imagen = screen.getByAltText('Gráfico generado');
      expect(imagen).toBeInTheDocument();
      expect(imagen.src).toContain('/static/charts/hist_edad_20250125.png');
    });
  });

  test('muestra estado de carga', async () => {
    const user = userEvent.setup();
    const mockGraficar = require('../services/api').graficar;
    
    // Simular una respuesta lenta
    mockGraficar.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        resultado: { ruta: '/test.png' }
      }), 100))
    );

    render(<VisualizarGrafico />);
    
    // Escribir columna y generar gráfico
    const inputColumna = screen.getByPlaceholderText('Nombre de la columna');
    await user.type(inputColumna, 'edad');
    
    const botonGenerar = screen.getByText('Generar gráfico');
    await user.click(botonGenerar);
    
    // Verificar que se muestre el estado de carga
    expect(screen.getByText('Generando...')).toBeInTheDocument();
    expect(botonGenerar).toBeDisabled();
  });

  test('valida input vacío', async () => {
    const user = userEvent.setup();
    render(<VisualizarGrafico />);
    
    // Intentar generar gráfico sin columna
    const botonGenerar = screen.getByText('Generar gráfico');
    await user.click(botonGenerar);
    
    // Verificar que se muestre mensaje de error
    await waitFor(() => {
      expect(screen.getByText('Por favor, ingresa el nombre de una columna.')).toBeInTheDocument();
    });
  });
}); 