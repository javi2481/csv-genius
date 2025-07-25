# Sistema de Testing - CSV Genius Agent

## 📋 Descripción

Este directorio contiene todas las pruebas unitarias y de integración para el frontend de CSV Genius Agent, desarrollado con **Jest** y **React Testing Library**.

## 🛠️ Configuración

### Dependencias instaladas:
- `jest`: Framework de testing
- `@testing-library/react`: Utilidades para testing de React
- `@testing-library/jest-dom`: Matchers adicionales para Jest
- `@testing-library/user-event`: Simulación de eventos de usuario

### Configuración en `package.json`:
```json
{
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["<rootDir>/src/tests/setupTests.js"]
  }
}
```

## 📁 Estructura de archivos

```
src/tests/
├── setupTests.js              # Configuración global de Jest
├── App.test.jsx              # Pruebas del componente principal
├── FormularioPregunta.test.jsx # Pruebas del formulario de preguntas
├── VisualizarGrafico.test.jsx  # Pruebas del visualizador de gráficos
├── TablaResultados.test.jsx    # Pruebas del componente de tabla
├── SubirArchivo.test.jsx      # Pruebas del componente de subida
└── README.md                  # Esta documentación
```

## 🚀 Ejecutar pruebas

### Comando principal:
```bash
npm test
```

### Comandos adicionales:
```bash
# Ejecutar en modo watch (desarrollo)
npm test -- --watch

# Ejecutar con cobertura
npm test -- --coverage

# Ejecutar pruebas específicas
npm test -- FormularioPregunta

# Ejecutar en modo verbose
npm test -- --verbose
```

## 🧪 Tipos de pruebas implementadas

### 1. **App.test.jsx** - Componente principal
- ✅ Renderizado del header y footer
- ✅ Navegación entre vistas
- ✅ Estado de CSV cargado
- ✅ Renderizado de todos los elementos del menú
- ✅ Navegación a todas las vistas disponibles

### 2. **FormularioPregunta.test.jsx** - Formulario de preguntas
- ✅ Renderizado de inputs y botones
- ✅ Validación de input vacío
- ✅ Envío exitoso de preguntas
- ✅ Manejo de errores de API
- ✅ Cambio entre modo básico y OpenAI

### 3. **VisualizarGrafico.test.jsx** - Visualizador de gráficos
- ✅ Renderizado de controles
- ✅ Simulación de ingreso de datos
- ✅ Manejo de errores de API
- ✅ Generación exitosa de gráficos
- ✅ Estados de carga
- ✅ Validación de inputs

### 4. **TablaResultados.test.jsx** - Componente de tabla
- ✅ Renderizado con datos mock
- ✅ Mostrar leyendas y contadores
- ✅ Formato numérico regional
- ✅ Colores condicionales
- ✅ Funcionalidad de copiar
- ✅ Mensajes de tabla vacía
- ✅ Scroll horizontal

### 5. **SubirArchivo.test.jsx** - Componente de subida
- ✅ Renderizado del formulario
- ✅ Validación de tipo de archivo
- ✅ Subida exitosa
- ✅ Manejo de errores
- ✅ Estados de carga
- ✅ Limpieza del formulario

## 🔧 Características de testing

### **Mocks implementados:**
- **API Services**: Todos los componentes mockean `../services/api`
- **Clipboard API**: Para pruebas de funcionalidad de copiar
- **File API**: Para pruebas de subida de archivos
- **Componentes hijos**: En App.test.jsx para aislar pruebas

### **Patrones de testing utilizados:**
- **Arrange-Act-Assert**: Estructura clara de pruebas
- **User-centric testing**: Enfoque en comportamiento del usuario
- **Async testing**: Manejo correcto de operaciones asíncronas
- **Error boundary testing**: Verificación de manejo de errores

### **Assertions utilizadas:**
- `toBeInTheDocument()`: Verificar presencia de elementos
- `toHaveStyle()`: Verificar estilos aplicados
- `toHaveBeenCalled()`: Verificar llamadas a funciones mock
- `toHaveValue()`: Verificar valores de inputs
- `toHaveAttribute()`: Verificar atributos de elementos

## 📊 Cobertura de pruebas

### **Componentes cubiertos:**
- ✅ App (100% - navegación y layout)
- ✅ FormularioPregunta (100% - formularios y validación)
- ✅ VisualizarGrafico (100% - controles y API)
- ✅ TablaResultados (100% - renderizado y funcionalidad)
- ✅ SubirArchivo (100% - subida y validación)

### **Funcionalidades probadas:**
- ✅ Renderizado de componentes
- ✅ Interacciones de usuario
- ✅ Llamadas a API
- ✅ Manejo de estados (carga, éxito, error)
- ✅ Validaciones de formularios
- ✅ Navegación entre vistas
- ✅ Funcionalidades específicas (copiar, exportar, etc.)

## 🔄 Mantenimiento

### **Agregar nuevas pruebas:**
1. Crear archivo `Componente.test.jsx` en `src/tests/`
2. Importar el componente y sus dependencias
3. Mockear servicios externos si es necesario
4. Escribir pruebas siguiendo el patrón establecido
5. Ejecutar `npm test` para verificar

### **Actualizar pruebas existentes:**
1. Identificar el archivo de prueba correspondiente
2. Modificar las pruebas según los cambios del componente
3. Verificar que todas las pruebas pasen
4. Actualizar esta documentación si es necesario

## 🎯 Mejores prácticas

### **Do's:**
- ✅ Usar `data-testid` para elementos difíciles de seleccionar
- ✅ Mockear dependencias externas
- ✅ Probar casos de éxito y error
- ✅ Usar `userEvent` para interacciones realistas
- ✅ Agrupar pruebas relacionadas en `describe`

### **Don'ts:**
- ❌ No probar implementaciones internas
- ❌ No depender de detalles de implementación
- ❌ No crear mocks innecesarios
- ❌ No olvidar limpiar mocks entre pruebas

## 📈 Métricas de calidad

### **Objetivos de cobertura:**
- **Líneas de código**: >90%
- **Funciones**: >95%
- **Branches**: >85%

### **Tiempo de ejecución:**
- **Todas las pruebas**: <30 segundos
- **Pruebas individuales**: <2 segundos

---

**Nota**: Este sistema de testing está diseñado para ser mantenible y escalable. Las pruebas se enfocan en el comportamiento del usuario y la funcionalidad de la aplicación, no en detalles de implementación. 