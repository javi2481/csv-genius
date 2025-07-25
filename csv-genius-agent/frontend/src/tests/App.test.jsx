import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock de todos los componentes hijos
jest.mock('../components/SubirArchivo', () => {
  return function MockSubirArchivo({ onUploadSuccess }) {
    return (
      <div data-testid="subir-archivo">
        <button onClick={onUploadSuccess}>Simular subida exitosa</button>
      </div>
    );
  };
});

jest.mock('../components/FormularioPregunta', () => {
  return function MockFormularioPregunta() {
    return <div data-testid="formulario-pregunta">Formulario de pregunta</div>;
  };
});

jest.mock('../components/VisualizarGrafico', () => {
  return function MockVisualizarGrafico() {
    return <div data-testid="visualizar-grafico">Visualizar gráfico</div>;
  };
});

jest.mock('../components/MostrarPerfilado', () => {
  return function MockMostrarPerfilado() {
    return <div data-testid="mostrar-perfilado">Mostrar perfilado</div>;
  };
});

jest.mock('../components/VerEstadisticasColumna', () => {
  return function MockVerEstadisticasColumna() {
    return <div data-testid="ver-estadisticas-columna">Ver estadísticas columna</div>;
  };
});

jest.mock('../components/CompararColumnas', () => {
  return function MockCompararColumnas() {
    return <div data-testid="comparar-columnas">Comparar columnas</div>;
  };
});

jest.mock('../components/FiltrarFilas', () => {
  return function MockFiltrarFilas() {
    return <div data-testid="filtrar-filas">Filtrar filas</div>;
  };
});

jest.mock('../components/LimpiarDatos', () => {
  return function MockLimpiarDatos() {
    return <div data-testid="limpiar-datos">Limpiar datos</div>;
  };
});

jest.mock('../components/ExportarCSV', () => {
  return function MockExportarCSV() {
    return <div data-testid="exportar-csv">Exportar CSV</div>;
  };
});

jest.mock('../components/DescargarResumen', () => {
  return function MockDescargarResumen() {
    return <div data-testid="descargar-resumen">Descargar resumen</div>;
  };
});

describe('App', () => {
  test('renderiza el header con título y subtítulo', () => {
    render(<App />);
    
    expect(screen.getByText('CSV Genius Agent')).toBeInTheDocument();
    expect(screen.getByText('Exploración inteligente de datos')).toBeInTheDocument();
  });

  test('renderiza la fecha actual', () => {
    render(<App />);
    
    const fechaElement = screen.getByText(/\w+, \d+ de \w+ de \d{4}/);
    expect(fechaElement).toBeInTheDocument();
  });

  test('renderiza todos los elementos del menú', () => {
    render(<App />);
    
    const menuItems = [
      '📁 Subir archivo',
      '📊 Mostrar perfilado',
      '❓ Preguntar sobre CSV',
      '📈 Visualizar gráfico',
      '📋 Estadísticas por columna',
      '⚖️ Comparar columnas',
      '🔍 Filtrar filas',
      '🧹 Limpiar datos',
      '💾 Exportar CSV',
      '📥 Descargar resumen'
    ];
    
    menuItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  test('muestra SubirArchivo por defecto', () => {
    render(<App />);
    
    expect(screen.getByTestId('subir-archivo')).toBeInTheDocument();
  });

  test('navega entre diferentes vistas', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Verificar que SubirArchivo esté visible inicialmente
    expect(screen.getByTestId('subir-archivo')).toBeInTheDocument();
    
    // Hacer clic en "Mostrar perfilado"
    const menuPerfilado = screen.getByText('📊 Mostrar perfilado');
    await user.click(menuPerfilado);
    
    // Verificar que se muestre la alerta de no CSV cargado
    expect(screen.getByText('⚠️ No hay archivo CSV cargado. Por favor, sube un archivo primero.')).toBeInTheDocument();
    
    // Verificar que el menú "Mostrar perfilado" esté resaltado
    expect(menuPerfilado.closest('li')).toHaveStyle({ backgroundColor: '#34495e' });
  });

  test('permite navegación cuando CSV está cargado', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Simular que se subió un archivo CSV
    const botonSimularSubida = screen.getByText('Simular subida exitosa');
    await user.click(botonSimularSubida);
    
    // Ahora debería poder navegar a otras vistas
    const menuPerfilado = screen.getByText('📊 Mostrar perfilado');
    await user.click(menuPerfilado);
    
    // Verificar que se muestre el componente MostrarPerfilado
    expect(screen.getByTestId('mostrar-perfilado')).toBeInTheDocument();
    
    // Verificar que no aparezca la alerta
    expect(screen.queryByText('⚠️ No hay archivo CSV cargado. Por favor, sube un archivo primero.')).not.toBeInTheDocument();
  });

  test('renderiza el footer', () => {
    render(<App />);
    
    expect(screen.getByText('CSV Genius Agent - Herramienta de análisis de datos inteligente')).toBeInTheDocument();
    expect(screen.getByText('Desarrollado con React + FastAPI + Python')).toBeInTheDocument();
  });

  test('navega a todas las vistas disponibles', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Simular que se subió un archivo CSV
    const botonSimularSubida = screen.getByText('Simular subida exitosa');
    await user.click(botonSimularSubida);
    
    // Navegar a cada vista y verificar que se renderice correctamente
    const vistas = [
      { menu: '📊 Mostrar perfilado', testId: 'mostrar-perfilado' },
      { menu: '❓ Preguntar sobre CSV', testId: 'formulario-pregunta' },
      { menu: '📈 Visualizar gráfico', testId: 'visualizar-grafico' },
      { menu: '📋 Estadísticas por columna', testId: 'ver-estadisticas-columna' },
      { menu: '⚖️ Comparar columnas', testId: 'comparar-columnas' },
      { menu: '🔍 Filtrar filas', testId: 'filtrar-filas' },
      { menu: '🧹 Limpiar datos', testId: 'limpiar-datos' },
      { menu: '💾 Exportar CSV', testId: 'exportar-csv' },
      { menu: '📥 Descargar resumen', testId: 'descargar-resumen' }
    ];
    
    for (const vista of vistas) {
      const menuItem = screen.getByText(vista.menu);
      await user.click(menuItem);
      expect(screen.getByTestId(vista.testId)).toBeInTheDocument();
    }
  });

  test('mantiene el estado de CSV cargado entre navegaciones', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Simular subida de CSV
    const botonSimularSubida = screen.getByText('Simular subida exitosa');
    await user.click(botonSimularSubida);
    
    // Navegar a diferentes vistas
    await user.click(screen.getByText('📊 Mostrar perfilado'));
    expect(screen.getByTestId('mostrar-perfilado')).toBeInTheDocument();
    
    await user.click(screen.getByText('❓ Preguntar sobre CSV'));
    expect(screen.getByTestId('formulario-pregunta')).toBeInTheDocument();
    
    // Verificar que no aparezca la alerta en ninguna vista
    expect(screen.queryByText('⚠️ No hay archivo CSV cargado. Por favor, sube un archivo primero.')).not.toBeInTheDocument();
  });
}); 