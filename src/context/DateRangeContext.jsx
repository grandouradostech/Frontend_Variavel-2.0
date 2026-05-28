import { createContext, useEffect, useMemo, useState } from 'react';

export const DateRangeContext = createContext();

const getDefaultDateRange = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return {
    dataInicio: `${year}-${month}-01`,
    dataFim: `${year}-${month}-${day}`,
  };
};

const STORAGE_KEY_INICIO = 'global_data_inicio';
const STORAGE_KEY_FIM = 'global_data_fim';

export const DateRangeProvider = ({ children }) => {
  const defaults = getDefaultDateRange();

  const [dataInicio, setDataInicio] = useState(() => localStorage.getItem(STORAGE_KEY_INICIO) || defaults.dataInicio);
  const [dataFim, setDataFim] = useState(() => localStorage.getItem(STORAGE_KEY_FIM) || defaults.dataFim);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_INICIO, dataInicio);
  }, [dataInicio]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FIM, dataFim);
  }, [dataFim]);

  const value = useMemo(
    () => ({
      dataInicio,
      dataFim,
      setDataInicio,
      setDataFim,
    }),
    [dataInicio, dataFim],
  );

  return <DateRangeContext.Provider value={value}>{children}</DateRangeContext.Provider>;
};
