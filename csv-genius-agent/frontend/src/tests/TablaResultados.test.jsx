import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TablaResultados from '../components/TablaResultados';

// Mock de navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe('TablaResultados', () => {
  const mockData = [
    { nombre: 'Juan', edad: 25, ciudad: 'Buenos Aires' },
    { nombre: 'María', edad: 30, ciudad: 'Córdoba' },
    { nombre: 'Carlos', edad: 35, ciudad: 'Rosario' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza correctamente una tabla con data mock', () => {
    render(
      <TablaResultados 
        data={mockData}
        leyenda="Datos de usuarios"
      />
    );
    
    // Verificar que se rendericen los encabezados
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Edad')).toBeInTheDocument();
    expect(screen.getByText('Ciudad')).toBeInTheDocument();
    
    // Verificar que se rendericen los datos
    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('Buenos Aires')).toBeInTheDocument();
    expect(screen.getByText('María')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('Córdoba')).toBeInTheDocument();
  });

  test('muestra la leyenda si se proporciona', () => {
    render(
      <TablaResultados 
        data={mockData}
        leyenda="Esta es una tabla de prueba"
      />
    );
    
    expect(screen.getByText('Esta es una tabla de prueba')).toBeInTheDocument();
  });

  test('muestra contadores cuando mostrarContadores está activado', () => {
    render(
      <TablaResultados 
        data={mockData}
        mostrarContadores={true}
      />
    );
    
    expect(screen.getByText('3 filas, 3 columnas')).toBeInTheDocument();
  });

  test('aplica formato numérico regional cuando numericasConFormato está activado', () => {
    const dataConNumeros = [
      { producto: 'A', precio: 1234.56, cantidad: 1000 },
      { producto: 'B', precio: 5678.90, cantidad: 2000 }
    ];

    render(
      <TablaResultados 
        data={dataConNumeros}
        numericasConFormato={true}
      />
    );
    
    // Verificar que los números se formateen correctamente
    expect(screen.getByText('1.234,56')).toBeInTheDocument();
    expect(screen.getByText('1.000')).toBeInTheDocument();
    expect(screen.getByText('5.678,9')).toBeInTheDocument();
    expect(screen.getByText('2.000')).toBeInTheDocument();
  });

  test('aplica colores condicionales', () => {
    const dataConValores = [
      { columna: 'A', valor: 10, estado: 'alto' },
      { columna: 'B', valor: 5, estado: 'bajo' }
    ];

    const coloresCondicionales = {
      valor: (v) => v > 8 ? 'lightblue' : '',
      estado: (v) => v === 'alto' ? '#ffe5e5' : ''
    };

    render(
      <TablaResultados 
        data={dataConValores}
        coloresCondicionales={coloresCondicionales}
      />
    );
    
    // Verificar que las celdas tengan los estilos aplicados
    const celdaValor10 = screen.getByText('10').closest('td');
    const celdaEstadoAlto = screen.getByText('alto').closest('td');
    
    expect(celdaValor10).toHaveStyle({ backgroundColor: 'lightblue' });
    expect(celdaEstadoAlto).toHaveStyle({ backgroundColor: '#ffe5e5' });
  });

  test('muestra mensaje cuando no hay datos', () => {
    render(
      <TablaResultados 
        data={[]}
        leyenda="Tabla vacía"
      />
    );
    
    expect(screen.getByText('⚠️ No se encontraron filas para mostrar')).toBeInTheDocument();
  });

  test('botón copiar funciona cuando copiarHabilitado está activado', async () => {
    const user = userEvent.setup();
    render(
      <TablaResultados 
        data={mockData}
        copiarHabilitado={true}
      />
    );
    
    // Buscar y hacer clic en el botón copiar
    const botonCopiar = screen.getByText('📋 Copiar');
    await user.click(botonCopiar);
    
    // Verificar que se llame a clipboard.writeText
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
    
    // Verificar que se muestre el mensaje de éxito
    await waitFor(() => {
      expect(screen.getByText('✅ Copiado al portapapeles')).toBeInTheDocument();
    });
  });

  test('no muestra botón copiar cuando copiarHabilitado está desactivado', () => {
    render(
      <TablaResultados 
        data={mockData}
        copiarHabilitado={false}
      />
    );
    
    expect(screen.queryByText('📋 Copiar')).not.toBeInTheDocument();
  });

  test('resalta clave especial cuando se proporciona', () => {
    const dataConClaveEspecial = [
      { id: 1, nombre: 'Juan', correlacion: 0.85 },
      { id: 2, nombre: 'María', correlacion: 0.92 }
    ];

    render(
      <TablaResultados 
        data={dataConClaveEspecial}
        claveEspecialResaltada="correlacion"
      />
    );
    
    // Verificar que las celdas de correlación tengan estilo especial
    const celdaCorrelacion1 = screen.getByText('0.85').closest('td');
    const celdaCorrelacion2 = screen.getByText('0.92').closest('td');
    
    expect(celdaCorrelacion1).toHaveStyle({ fontWeight: 'bold' });
    expect(celdaCorrelacion2).toHaveStyle({ fontWeight: 'bold' });
  });

  test('tiene scroll horizontal para tablas grandes', () => {
    render(
      <TablaResultados 
        data={mockData}
      />
    );
    
    const tablaContainer = screen.getByRole('table').parentElement;
    expect(tablaContainer).toHaveStyle({ overflowX: 'auto' });
  });

  test('capitaliza los encabezados de columnas', () => {
    const dataConColumnas = [
      { nombre_usuario: 'Juan', fecha_nacimiento: '1990-01-01' }
    ];

    render(
      <TablaResultados 
        data={dataConColumnas}
      />
    );
    
    // Verificar que los encabezados estén capitalizados
    expect(screen.getByText('Nombre Usuario')).toBeInTheDocument();
    expect(screen.getByText('Fecha Nacimiento')).toBeInTheDocument();
  });
}); 