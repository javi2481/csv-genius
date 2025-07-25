#!/usr/bin/env python3
"""
Script de prueba para verificar la integración de OpenAI
"""

import os
import sys
from dotenv import load_dotenv

# Agregar el directorio actual al path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from openai_utils import interpretar_pregunta_openai, consultar_openai_directo

def test_openai_integration():
    """Prueba la integración con OpenAI"""
    
    # Cargar variables de entorno
    load_dotenv()
    
    # Verificar API key
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        print("❌ Error: No se encontró OPENAI_API_KEY en las variables de entorno")
        print("   Asegúrate de crear un archivo .env con tu API key")
        return False
    
    if api_key == "sk-your-openai-api-key-here":
        print("❌ Error: API key no configurada")
        print("   Edita el archivo .env y agrega tu API key real")
        return False
    
    print("✅ API key encontrada")
    
    # Contexto de prueba
    contexto_prueba = """
    Dataset de ejemplo:
    - Columnas: ['edad', 'ingresos', 'ciudad', 'genero']
    - Tipos: edad (numérico), ingresos (numérico), ciudad (categórico), genero (categórico)
    - Filas: 1000
    - Valores nulos: edad (5), ingresos (10), ciudad (0), genero (2)
    - Estadísticas: edad (media: 35.2, min: 18, max: 65), ingresos (media: 45000, min: 25000, max: 120000)
    """
    
    # Prueba 1: Interpretación de pregunta
    print("\n🧪 Probando interpretación de pregunta...")
    try:
        resultado = interpretar_pregunta_openai(
            pregunta="¿Cuál es la media de edad?",
            contexto=contexto_prueba
        )
        
        if resultado.get('error'):
            print(f"❌ Error en interpretación: {resultado['mensaje']}")
            return False
        
        print(f"✅ Interpretación exitosa:")
        print(f"   Acción: {resultado.get('accion')}")
        print(f"   Columna: {resultado.get('columna')}")
        print(f"   Mensaje: {resultado.get('mensaje')}")
        
    except Exception as e:
        print(f"❌ Error en interpretación: {str(e)}")
        return False
    
    # Prueba 2: Consulta directa
    print("\n🧪 Probando consulta directa...")
    try:
        resultado = consultar_openai_directo(
            pregunta="¿Qué observas sobre la distribución de edades en este dataset?",
            contexto=contexto_prueba
        )
        
        if resultado.get('error'):
            print(f"❌ Error en consulta directa: {resultado['mensaje']}")
            return False
        
        print(f"✅ Consulta directa exitosa:")
        print(f"   Modelo usado: {resultado.get('modelo_usado')}")
        print(f"   Respuesta: {resultado.get('respuesta')[:100]}...")
        
    except Exception as e:
        print(f"❌ Error en consulta directa: {str(e)}")
        return False
    
    print("\n🎉 ¡Todas las pruebas pasaron! La integración con OpenAI está funcionando correctamente.")
    return True

def main():
    """Función principal"""
    print("🤖 Probando integración con OpenAI...")
    print("=" * 50)
    
    success = test_openai_integration()
    
    if success:
        print("\n✅ Configuración completada exitosamente")
        print("   Puedes usar el modo OpenAI en la aplicación")
    else:
        print("\n❌ Configuración falló")
        print("   Revisa los errores anteriores y configura tu API key")
    
    return 0 if success else 1

if __name__ == "__main__":
    exit(main()) 