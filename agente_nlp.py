import re
from utilidades import normalizar_pregunta, validar_columna
from graficador import generar_grafico

def interpretar_pregunta(pregunta, df, contexto_eda):
    ''' Interpreta una pregunta y devuelve una respuesta textual o un gráfico '''
    
    for columna in df.columns:
        if validar_columna(columna, pregunta):
            if any([palabra in pregunta for palabra in ["media", "promedio", "mean", "average", "avg"]]):
                return f"El promedio de la columna {columna} es {df[columna].mean():.2f}"
            if "desviacion" in pregunta:
                return f"La desviacion estandar de la columna {columna} es {df[columna].std():.2f}"
            if "histograma" in pregunta:
                return generar_grafico(df, "histograma", [columna])
            if "barras" in pregunta:
                return generar_grafico(df, "barras", [columna])
    
    if "correlacion" or "heatmap" in pregunta:
        return generar_grafico(df, "correlacion", list(df.select_dtypes(include='number').columns))
    
    if "nulos" or "faltante" or "missing"in pregunta:
        nulos = df.isnull().sum()
        mas_nulos = nulos.idxmax()
        return f"La columna con mas nulos es {mas_nulos} con {nulos[mas_nulos]} nulos"
    
    if "resumen" or "describe" in pregunta:
        return df.describe()
    
    return "No se pudo generar la respuesta"
