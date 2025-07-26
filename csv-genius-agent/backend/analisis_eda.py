# analisis_eda.py
# Este archivo contendrá funciones para análisis estadístico, tipos de datos y detección de valores nulos en el CSV.

import pandas as pd
import os
from ydata_profiling import ProfileReport
import json
import traceback
from visualizaciones import (
    generar_heatmap_correlacion, 
    generar_histogramas_principales,
    generar_graficos_barras_principales
)

# Constantes
RUTA_REPORTE_JSON = os.path.join('static', 'reports', 'reporte_descriptivo.json')
LIMITE_COLS_NUMERICAS_HIST = 5  # Límite de histogramas a generar
LIMITE_COLS_CATEGORICAS_BARRAS = 5 # Límite de gráficos de barras a generar

# Ruta por defecto para guardar los perfiles
PROFILE_DIR = os.path.join(os.path.dirname(__file__), 'data')
if not os.path.exists(PROFILE_DIR):
    os.makedirs(PROFILE_DIR)


def generar_reporte_json(df):
    """Genera un reporte de perfilado y lo guarda como JSON."""
    if os.path.exists(RUTA_REPORTE_JSON):
        os.remove(RUTA_REPORTE_JSON)
    
    perfil = ProfileReport(df, title="Reporte de Análisis Descriptivo", explorative=True)
    perfil.to_file(RUTA_REPORTE_JSON)

def cargar_reporte_json():
    """Carga el reporte JSON si existe."""
    if os.path.exists(RUTA_REPORTE_JSON):
        with open(RUTA_REPORTE_JSON, 'r') as f:
            return json.load(f)
    return None


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
    return os.path.exists(RUTA_REPORTE_JSON)


def realizar_analisis_exploratorio_completo(df):
    """
    Realiza un análisis exploratorio robusto y automático del DataFrame.
    Cada paso se envuelve en un try-except para asegurar que se devuelva un resultado parcial
    incluso si una parte del análisis falla.
    """
    analisis_resultado = {
        "analisis_completo": True,
        "error": False,
        "mensaje_error": "",
        "estadisticas_descriptivas": {},
        "valores_nulos": {},
        "estadisticas_categoricas": {},
        "matriz_correlacion": {},
        "visualizaciones": {
            "heatmap_correlacion": None,
            "histogramas": {},
            "graficos_barras": {}
        }
    }

    try:
        columnas_numericas = df.select_dtypes(include=['number']).columns.tolist()
        columnas_categoricas = df.select_dtypes(include=['object', 'category']).columns.tolist()

        # 1. Estadísticas Descriptivas
        try:
            analisis_resultado["estadisticas_descriptivas"] = df[columnas_numericas].describe().round(2).to_dict()
        except Exception as e:
            analisis_resultado["mensaje_error"] += f"Error en stats descriptivas: {e}. "
            print(f"Error en stats descriptivas: {e}")

        # 2. Valores Nulos
        try:
            valores_nulos = df.isnull().sum()
            analisis_resultado["valores_nulos"] = valores_nulos[valores_nulos > 0].to_dict()
        except Exception as e:
            analisis_resultado["mensaje_error"] += f"Error en valores nulos: {e}. "
            print(f"Error en valores nulos: {e}")

        # 3. Estadísticas Categóricas
        try:
            analisis_resultado["estadisticas_categoricas"] = {
                col: {"valores_unicos": df[col].nunique(), "moda": df[col].mode().iloc[0] if not df[col].mode().empty else 'N/A'}
                for col in columnas_categoricas
            }
        except Exception as e:
            analisis_resultado["mensaje_error"] += f"Error en stats categóricas: {e}. "
            print(f"Error en stats categóricas: {e}")

        # 4. Matriz de Correlación (cálculo y visualización)
        try:
            if len(columnas_numericas) > 1:
                analisis_resultado["matriz_correlacion"] = df[columnas_numericas].corr().round(2).to_dict()
                analisis_resultado["visualizaciones"]["heatmap_correlacion"] = generar_heatmap_correlacion(df[columnas_numericas])
        except Exception as e:
            analisis_resultado["mensaje_error"] += f"Error en correlación: {e}. "
            print(f"Error en correlación: {e}")
            traceback.print_exc()

        # 5. Histogramas
        try:
            analisis_resultado["visualizaciones"]["histogramas"] = generar_histogramas_principales(
                df, columnas_numericas, LIMITE_COLS_NUMERICAS_HIST
            )
        except Exception as e:
            analisis_resultado["mensaje_error"] += f"Error en histogramas: {e}. "
            print(f"Error en histogramas: {e}")

        # 6. Gráficos de Barras
        try:
            analisis_resultado["visualizaciones"]["graficos_barras"] = generar_graficos_barras_principales(
                df, columnas_categoricas, LIMITE_COLS_CATEGORICAS_BARRAS
            )
        except Exception as e:
            analisis_resultado["mensaje_error"] += f"Error en gráficos de barras: {e}. "
            print(f"Error en gráficos de barras: {e}")

        if analisis_resultado["mensaje_error"]:
            analisis_resultado["error"] = True

        return analisis_resultado

    except Exception as e:
        print(f"Error crítico durante el análisis exploratorio: {e}")
        traceback.print_exc()
        return {"analisis_completo": False, "error": True, "mensaje": str(e)}


def contexto_textual_desde_reporte(reporte):
    """Extrae un contexto textual simple del reporte JSON para la IA."""
    if not reporte or 'table' not in reporte:
        return "No hay información de análisis disponible."

    n_vars = reporte['table']['n_variables']
    n_obs = reporte['table']['n']
    missing_cells = reporte['table']['p_cells_missing'] * 100
    
    contexto = (
        f"El conjunto de datos tiene {n_vars} columnas y {n_obs} filas. "
        f"El porcentaje de datos faltantes es {missing_cells:.2f}%."
    )
    return contexto 