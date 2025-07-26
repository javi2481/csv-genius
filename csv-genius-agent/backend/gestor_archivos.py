# gestor_archivos.py
# Este archivo contendrá funciones para cargar, guardar y validar archivos CSV y gráficos.

import os
import pandas as pd

# Carpeta y nombre fijo para el dataset activo
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
CSV_ACTIVO = os.path.join(DATA_DIR, 'ultimo_archivo.csv')

if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)


def guardar_csv(file) -> str:
    """
    Guarda el archivo CSV subido por el usuario como 'ultimo_archivo.csv' en la carpeta data/.
    'file' puede ser un objeto file-like (por ejemplo, UploadFile de FastAPI o un archivo abierto en modo binario).
    Devuelve la ruta donde se guardó el archivo.
    """
    try:
        with open(CSV_ACTIVO, 'wb') as f:
            if hasattr(file, 'file'):
                # Caso UploadFile de FastAPI
                content = file.file.read()
                f.write(content)
                # Resetear el cursor para futuras lecturas
                file.file.seek(0)
            else:
                # Caso archivo binario estándar
                content = file.read()
                f.write(content)
                # Resetear el cursor si es posible
                if hasattr(file, 'seek'):
                    file.seek(0)
        
        print(f"Archivo guardado exitosamente en: {CSV_ACTIVO}")  # Debug
        return CSV_ACTIVO
    except Exception as e:
        print(f"Error guardando archivo: {str(e)}")  # Debug
        raise e


def cargar_csv() -> pd.DataFrame:
    """
    Carga el archivo CSV activo como un DataFrame de pandas.
    Lanza excepción si no existe el archivo.
    """
    if not os.path.exists(CSV_ACTIVO):
        raise FileNotFoundError("No se ha subido ningún archivo CSV todavía.")
    return pd.read_csv(CSV_ACTIVO)


def existe_csv() -> bool:
    """
    Verifica si existe el archivo CSV activo.
    """
    return os.path.exists(CSV_ACTIVO) 