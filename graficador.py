import matplotlib.pyplot as plt
import seaborn as sns

def generar_grafico(df, tipo, columnas):
    """ Genera un grafico de tipo barra, histograma, dispersion o correlacion. """

    fig, ax = plt.subplots()
    
    if tipo == "barras":
        sns.countplot(data=df, x=columnas[0], ax=ax)
        ax.set_title(f"Grafico de barras - {columnas[0]}")
    elif tipo == "histograma":
        sns.histplot(data=df, x=columnas[0], ax=ax)
        ax.set_title(f"Histograma - {columnas[0]}")
    elif tipo == "dispersion":
        sns.scatterplot(data=df, x=columnas[0], y=columnas[1], ax=ax)
        ax.set_title(f"Grafico de dispersion - {columnas[0]} vs {columnas[1]}")
    elif tipo == "correlacion":
        sns.heatmap(data=df.corr(), ax=ax)
        ax.set_title("Mapa de calor de correlaciones")
    else:
        return f"ax.text(0.5, 0.5, 'Tipo de grafico no valido', ha='center', va='center')"
    fig.tight_layout()
    return fig
    