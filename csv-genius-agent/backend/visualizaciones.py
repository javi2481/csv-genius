# visualizaciones.py
# Este archivo contendrá las funciones para generar gráficos (por ejemplo, histogramas) usando matplotlib.

import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import os

# Configuración inicial para Matplotlib
plt.switch_backend('Agg')  # Usar un backend no interactivo
sns.set_theme(style="whitegrid")

# Constantes
RUTA_GRAFICOS = os.path.join('static', 'charts')
os.makedirs(RUTA_GRAFICOS, exist_ok=True)

def generar_heatmap_correlacion(df_numeric):
    """Genera un mapa de calor de la matriz de correlación y lo guarda."""
    if df_numeric.empty or df_numeric.shape[1] < 2:
        return None
    try:
        plt.figure(figsize=(12, 10))
        corr = df_numeric.corr()
        sns.heatmap(corr, annot=True, fmt=".2f", cmap='coolwarm', linewidths=.5)
        plt.title('Matriz de Correlación', fontsize=16)
        plt.xticks(rotation=45, ha='right')
        plt.yticks(rotation=0)
        
        ruta_guardado = os.path.join(RUTA_GRAFICOS, 'heatmap_correlacion.png')
        plt.savefig(ruta_guardado, dpi=300, bbox_inches='tight')
        plt.close()
        return f"/{ruta_guardado}".replace("\\", "/")
    except Exception as e:
        print(f"Error generando heatmap: {e}")
        return None

def generar_histogramas_principales(df, columnas_numericas, limite):
    """Genera histogramas para las columnas numéricas principales."""
    rutas = {}
    cols_a_graficar = columnas_numericas[:limite]
    for col in cols_a_graficar:
        try:
            plt.figure(figsize=(8, 5))
            sns.histplot(df[col], kde=True, bins=30)
            plt.title(f'Distribución de {col}', fontsize=14)
            plt.xlabel(col)
            plt.ylabel('Frecuencia')
            
            ruta_guardado = os.path.join(RUTA_GRAFICOS, f'hist_{col}.png')
            plt.savefig(ruta_guardado, dpi=150, bbox_inches='tight')
            plt.close()
            rutas[col] = f"/{ruta_guardado}".replace("\\", "/")
        except Exception as e:
            print(f"Error generando histograma para {col}: {e}")
    return rutas

def generar_graficos_barras_principales(df, columnas_categoricas, limite):
    """Genera gráficos de barras para las columnas categóricas principales."""
    rutas = {}
    cols_a_graficar = [col for col in columnas_categoricas if df[col].nunique() < 50][:limite]
    for col in cols_a_graficar:
        try:
            plt.figure(figsize=(10, 6))
            top_10 = df[col].value_counts().nlargest(10)
            ax = sns.barplot(x=top_10.index, y=top_10.values, palette="viridis")
            plt.title(f'Frecuencia en {col} (Top 10)', fontsize=14)
            plt.xlabel(col)
            plt.ylabel('Conteo')
            plt.xticks(rotation=45, ha='right')

            # Añadir etiquetas de valor
            for p in ax.patches:
                ax.annotate(f'{int(p.get_height())}', 
                            (p.get_x() + p.get_width() / 2., p.get_height()), 
                            ha = 'center', va = 'center', 
                            xytext = (0, 9), 
                            textcoords = 'offset points')

            ruta_guardado = os.path.join(RUTA_GRAFICOS, f'bar_{col}.png')
            plt.savefig(ruta_guardado, dpi=150, bbox_inches='tight')
            plt.close()
            rutas[col] = f"/{ruta_guardado}".replace("\\", "/")
        except Exception as e:
            print(f"Error generando gráfico de barras para {col}: {e}")
    return rutas

def generar_histograma(columna, df):
    """Genera un único histograma para una columna específica."""
    try:
        if columna not in df.columns:
            raise ValueError(f"La columna '{columna}' no existe.")
        if not pd.api.types.is_numeric_dtype(df[columna]):
            # Intentar convertir, si falla, lanzar error
            df[columna] = pd.to_numeric(df[columna], errors='coerce')
            if df[columna].isnull().all():
                raise TypeError(f"La columna '{columna}' no contiene datos numéricos.")
        
        plt.figure(figsize=(8, 5))
        sns.histplot(df[columna].dropna(), kde=True, bins=30)
        plt.title(f'Distribución de {columna}', fontsize=14)
        
        ruta_guardado = os.path.join(RUTA_GRAFICOS, f'hist_{columna}.png')
        plt.savefig(ruta_guardado, dpi=150, bbox_inches='tight')
        plt.close()
        return f"/{ruta_guardado}".replace("\\", "/")
    except (ValueError, TypeError) as e:
        # Errores específicos de datos
        raise e
    except Exception as e:
        # Otros errores inesperados
        print(f"Error inesperado al generar histograma para {columna}: {e}")
        raise RuntimeError("No se pudo generar el gráfico.")

def generar_barras(columna, df):
    """Genera un único gráfico de barras para una columna específica."""
    try:
        if columna not in df.columns:
            raise ValueError(f"La columna '{columna}' no existe.")
        
        plt.figure(figsize=(10, 6))
        top_15 = df[columna].value_counts().nlargest(15)
        ax = sns.barplot(x=top_15.index, y=top_15.values, palette="viridis")
        plt.title(f'Frecuencia de categorías en {columna} (Top 15)', fontsize=14)
        plt.xticks(rotation=45, ha='right')
        
        # Añadir etiquetas
        for p in ax.patches:
            ax.annotate(f'{int(p.get_height())}', (p.get_x() + p.get_width() / 2., p.get_height()),
                        ha='center', va='center', xytext=(0, 9), textcoords='offset points')

        ruta_guardado = os.path.join(RUTA_GRAFICOS, f'bar_{columna}.png')
        plt.savefig(ruta_guardado, dpi=150, bbox_inches='tight')
        plt.close()
        return f"/{ruta_guardado}".replace("\\", "/")
    except Exception as e:
        print(f"Error inesperado al generar gráfico de barras para {columna}: {e}")
        raise RuntimeError("No se pudo generar el gráfico.") 