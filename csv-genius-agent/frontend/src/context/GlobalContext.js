// GlobalContext.js
// Contexto global para manejar el estado de la aplicación

import React, { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext debe usarse dentro de un GlobalProvider');
  }
  return context;
};

export const GlobalProvider = ({ children }) => {
  const [csvCargado, setCsvCargado] = useState(false);
  const [csvInfo, setCsvInfo] = useState(null);
  const [openaiDisponible, setOpenaiDisponible] = useState(false);

  const cargarCSV = (info) => {
    setCsvCargado(true);
    setCsvInfo(info);
  };

  const descargarCSV = () => {
    setCsvCargado(false);
    setCsvInfo(null);
  };

  const setOpenAIStatus = (disponible) => {
    setOpenaiDisponible(disponible);
  };

  return (
    <GlobalContext.Provider value={{
      csvCargado,
      csvInfo,
      openaiDisponible,
      cargarCSV,
      descargarCSV,
      setOpenAIStatus
    }}>
      {children}
    </GlobalContext.Provider>
  );
}; 