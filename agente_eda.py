import pandas as pd
from funpymodeling.exploratory import status, freq_tbl, profile_num
from ydata_profiling import ProfileReport
import json
import os

def obtener_contexto_eda(df):
    """
    Genera un resumen exploratorio del dataset y lo guarda como JSON
    """
    contexto = {}

    # Estado general de las columnas (tipo, nulos, únicos, etc.)
    contexto['estado_columnas'] = status(df).to_dict(orient='list')

    # Estadísticas numéricas de las columnas numéricas
    columnas_numericas = df.select_dtypes(include='number').columns  # Selecciona nombres de columnas numéricas
    contexto['resumen_numerico'] = profile_num(df[columnas_numericas]).to_dict(orient='list')

    # Frecuencia de variables categóricas
    columnas_categoricas = df.select_dtypes(include=['object']).columns  # Selecciona columnas categóricas
    contexto['frecuencias'] = {col: freq_tbl(df[col]).to_dict(orient='list') for col in columnas_categoricas}  # Calcula frecuencias

    # Perfilado avanzado del dataset (sin visuales)
    informe = ProfileReport(df, minimal=True, explorative=True, correlations={"pearson":{"calculate":True}})
    try:
        contexto['perfil_avanzado'] = informe.get_description()  # Obtiene descripción avanzada
    except Exception as e:
        print(f"Error al generar perfil avanzado: {e}")
        contexto['perfil_avanzado'] = {}  # Si falla, guarda un diccionario vacío
    
    # Guarda el resumen en un archivo JSON
    os.makedirs('contexto', exist_ok=True)  # Crea la carpeta si no existe
    with open('contexto/resumen_eda.json', 'w', encoding='utf-8') as salida:
        json.dump(contexto, salida, indent=2, ensure_ascii=False)  # Escribe el resumen en JSON

    return contexto  # Devuelve el resumen generado
