import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SubirArchivo from '../components/SubirArchivo';

// Mock del módulo de API
jest.mock('../services/api', () => ({
  subirCSV: jest.fn()
}));

describe('SubirArchivo', () => {
  const mockOnUploadSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza correctamente el formulario de subida', () => {
    render(<SubirArchivo onUploadSuccess={mockOnUploadSuccess} />);
    
    // Verificar que se rendericen los elementos principales
    expect(screen.getByText('Subir archivo CSV')).toBeInTheDocument();
    expect(screen.getByText('Seleccionar archivo')).toBeInTheDocument();
    expect(screen.getByText('Subir')).toBeInTheDocument();
  });

  test('acepta solo archivos CSV', () => {
    render(<SubirArchivo onUploadSuccess={mockOnUploadSuccess} />);
    
    const inputFile = screen.getByLabelText(/seleccionar archivo/i);
    expect(inputFile).toHaveAttribute('accept', '.csv');
  });

  test('sube archivo exitosamente', async () => {
    const user = userEvent.setup();
    const mockSubirCSV = require('../services/api').subirCSV;
    mockSubirCSV.mockResolvedValue({
      ok: true,
      mensaje: 'Archivo subido correctamente'
    });

    render(<SubirArchivo onUploadSuccess={mockOnUploadSuccess} />);
    
    // Crear un archivo mock
    const file = new File(['nombre,edad\nJuan,25\nMaría,30'], 'test.csv', {
      type: 'text/csv',
    });
    
    // Simular selección de archivo
    const inputFile = screen.getByLabelText(/seleccionar archivo/i);
    await user.upload(inputFile, file);
    
    // Verificar que se muestre el nombre del archivo
    expect(screen.getByText('test.csv')).toBeInTheDocument();
    
    // Hacer clic en subir
    const botonSubir = screen.getByText('Subir');
    await user.click(botonSubir);
    
    // Verificar que se llame a la API
    await waitFor(() => {
      expect(mockSubirCSV).toHaveBeenCalledWith(file);
    });
    
    // Verificar que se muestre el mensaje de éxito
    await waitFor(() => {
      expect(screen.getByText('Archivo subido correctamente')).toBeInTheDocument();
    });
    
    // Verificar que se llame al callback
    await waitFor(() => {
      expect(mockOnUploadSuccess).toHaveBeenCalled();
    });
  });

  test('maneja errores de subida', async () => {
    const user = userEvent.setup();
    const mockSubirCSV = require('../services/api').subirCSV;
    mockSubirCSV.mockResolvedValue({
      ok: false,
      mensaje: 'Error al subir el archivo'
    });

    render(<SubirArchivo onUploadSuccess={mockOnUploadSuccess} />);
    
    // Crear y subir archivo
    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const inputFile = screen.getByLabelText(/seleccionar archivo/i);
    await user.upload(inputFile, file);
    
    const botonSubir = screen.getByText('Subir');
    await user.click(botonSubir);
    
    // Verificar que se muestre el error
    await waitFor(() => {
      expect(screen.getByText('Error al subir el archivo')).toBeInTheDocument();
    });
    
    // Verificar que NO se llame al callback
    expect(mockOnUploadSuccess).not.toHaveBeenCalled();
  });

  test('muestra estado de carga durante la subida', async () => {
    const user = userEvent.setup();
    const mockSubirCSV = require('../services/api').subirCSV;
    
    // Simular una respuesta lenta
    mockSubirCSV.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        mensaje: 'Archivo subido correctamente'
      }), 100))
    );

    render(<SubirArchivo onUploadSuccess={mockOnUploadSuccess} />);
    
    // Crear y subir archivo
    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const inputFile = screen.getByLabelText(/seleccionar archivo/i);
    await user.upload(inputFile, file);
    
    const botonSubir = screen.getByText('Subir');
    await user.click(botonSubir);
    
    // Verificar que se muestre el estado de carga
    expect(screen.getByText('Subiendo...')).toBeInTheDocument();
    expect(botonSubir).toBeDisabled();
  });

  test('valida que se seleccione un archivo antes de subir', async () => {
    const user = userEvent.setup();
    render(<SubirArchivo onUploadSuccess={mockOnUploadSuccess} />);
    
    // Intentar subir sin seleccionar archivo
    const botonSubir = screen.getByText('Subir');
    await user.click(botonSubir);
    
    // Verificar que se muestre mensaje de error
    await waitFor(() => {
      expect(screen.getByText('Por favor, selecciona un archivo CSV.')).toBeInTheDocument();
    });
  });

  test('limpia el formulario después de una subida exitosa', async () => {
    const user = userEvent.setup();
    const mockSubirCSV = require('../services/api').subirCSV;
    mockSubirCSV.mockResolvedValue({
      ok: true,
      mensaje: 'Archivo subido correctamente'
    });

    render(<SubirArchivo onUploadSuccess={mockOnUploadSuccess} />);
    
    // Subir archivo
    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const inputFile = screen.getByLabelText(/seleccionar archivo/i);
    await user.upload(inputFile, file);
    
    const botonSubir = screen.getByText('Subir');
    await user.click(botonSubir);
    
    // Verificar que después del éxito, el input esté limpio
    await waitFor(() => {
      expect(inputFile.files).toHaveLength(0);
    });
  });
}); 