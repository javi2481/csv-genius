# analisis_eda.py
# Este archivo contendrá funciones para análisis estadístico, tipos de datos y detección de valores nulos en el CSV.

import pandas as pd
import os
from ydata_profiling import ProfileReport
import json

# Ruta por defecto para guardar los perfiles
PROFILE_DIR = os.path.join(os.path.dirname(__file__), 'data')
if not os.path.exists(PROFILE_DIR):
    os.makedirs(PROFILE_DIR)

REPORTE_JSON = os.path.join(PROFILE_DIR, 'ultimo_reporte.json')


def generar_reporte_json(df: pd.DataFrame) -> dict:
    """
    Genera un reporte estructurado del DataFrame usando ydata-profiling y lo guarda como JSON.
    No genera ni guarda HTML.
    Devuelve el dict extraído del ProfileReport.
    """
    perfil = ProfileReport(df, title="Análisis Automático del CSV", explorative=True)
    reporte_dict = perfil.to_dict()
    # Guardar solo el JSON
    with open(REPORTE_JSON, 'w', encoding='utf-8') as f:
        json.dump(reporte_dict, f, ensure_ascii=False, indent=2)
    return reporte_dict


def cargar_reporte_json() -> dict:
    """
    Carga el último reporte generado en formato JSON.
    """
    if os.path.exists(REPORTE_JSON):
        with open(REPORTE_JSON, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}


def resumen_simple(df: pd.DataFrame) -> dict:
    """
    Devuelve un resumen rápido del DataFrame: describe, tipos de datos y nulos.
    """
    resumen = {
        "describe": df.describe(include='all').fillna('').to_dict(),
        "tipos": df.dtypes.apply(lambda x: x.name).to_dict(),
        "nulos": df.isnull().sum().to_dict(),
        "columnas": list(df.columns),
        "ejemplo_filas": df.head(3).to_dict(orient='records')
    }
    return resumen


def columnas_con_nulos(df: pd.DataFrame) -> list:
    """
    Devuelve una lista de columnas que tienen valores nulos.
    """
    return [col for col, nulos in df.isnull().sum().items() if nulos > 0]


def existe_reporte_json() -> bool:
    """
    Verifica si existe un reporte generado (JSON).
    """
    return os.path.exists(REPORTE_JSON)


def contexto_textual_desde_reporte(reporte: dict) -> str:
    """
    Convierte el JSON del reporte de ydata-profiling en un contexto textual legible para OpenAI.
    Extrae columnas, tipos, estadísticas y proporciones de nulos.
    """
    if not reporte:
        return "No hay reporte disponible."
    # Extraer información relevante
    try:
        variables = reporte.get('variables', {})
        columnas = list(variables.keys())
        tipos = {col: variables[col].get('type') for col in columnas}
        nulos = {col: variables[col].get('n_missing', 0) for col in columnas}
        unicos = {col: variables[col].get('n_unique', 0) for col in columnas}
        stats = {col: {k: v for k, v in variables[col].items() if k in ['mean', 'std', 'min', 'max', 'median']} for col in columnas}
        contexto = (
            f"Columnas: {columnas}\n"
            f"Tipos de datos: {tipos}\n"
            f"Valores únicos por columna: {unicos}\n"
            f"Valores nulos por columna: {nulos}\n"
            f"Estadísticas principales: {stats}\n"
        )
        return contexto
    except Exception as e:
        return f"No se pudo generar contexto textual: {str(e)}" 