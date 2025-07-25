# visualizaciones.py
# Este archivo contendrá las funciones para generar gráficos (por ejemplo, histogramas) usando matplotlib.

import os
import matplotlib.pyplot as plt
import pandas as pd
from datetime import datetime

# Carpeta donde se guardarán los gráficos generados
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)


def generar_histograma(columna: str, df: pd.DataFrame) -> str:
    """
    Genera un histograma para una columna numérica y guarda el gráfico como PNG.
    Retorna la ruta del archivo generado.
    """
    if columna not in df.columns:
        raise ValueError(f"La columna '{columna}' no existe en el DataFrame.")
    if not pd.api.types.is_numeric_dtype(df[columna]):
        raise TypeError(f"La columna '{columna}' no es numérica y no se puede graficar como histograma.")
    plt.figure(figsize=(8, 5))
    df[columna].dropna().hist(bins=30, color='skyblue', edgecolor='black')
    plt.title(f'Histograma de {columna}')
    plt.xlabel(columna)
    plt.ylabel('Frecuencia')
    nombre_archivo = f"hist_{columna}_{datetime.now().strftime('%Y%m%d%H%M%S')}.png"
    ruta_archivo = os.path.join(DATA_DIR, nombre_archivo)
    try:
        plt.tight_layout()
        plt.savefig(ruta_archivo)
        plt.close()
        return ruta_archivo
    except Exception as e:
        plt.close()
        raise RuntimeError(f"Error al guardar el histograma: {str(e)}")


def generar_barras(columna: str, df: pd.DataFrame, max_categorias: int = 20) -> str:
    """
    Genera un gráfico de barras para una columna categórica y guarda el gráfico como PNG.
    Retorna la ruta del archivo generado.
    Si la columna tiene demasiadas categorías únicas, lanza excepción.
    """
    if columna not in df.columns:
        raise ValueError(f"La columna '{columna}' no existe en el DataFrame.")
    if not (pd.api.types.is_object_dtype(df[columna]) or pd.api.types.is_categorical_dtype(df[columna])):
        raise TypeError(f"La columna '{columna}' no es categórica y no se puede graficar como barras.")
    conteos = df[columna].value_counts().head(max_categorias)
    if conteos.shape[0] < 2:
        raise ValueError(f"La columna '{columna}' no tiene suficientes categorías para graficar.")
    if df[columna].nunique() > max_categorias:
        raise ValueError(f"La columna '{columna}' tiene demasiadas categorías únicas para graficar (máx: {max_categorias}).")
    plt.figure(figsize=(10, 5))
    conteos.plot(kind='bar', color='orange', edgecolor='black')
    plt.title(f'Gráfico de barras de {columna}')
    plt.xlabel(columna)
    plt.ylabel('Frecuencia')
    nombre_archivo = f"barras_{columna}_{datetime.now().strftime('%Y%m%d%H%M%S')}.png"
    ruta_archivo = os.path.join(DATA_DIR, nombre_archivo)
    try:
        plt.tight_layout()
        plt.savefig(ruta_archivo)
        plt.close()
        return ruta_archivo
    except Exception as e:
        plt.close()
        raise RuntimeError(f"Error al guardar el gráfico de barras: {str(e)}") 