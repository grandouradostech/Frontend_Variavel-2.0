import React, { useContext, useMemo, useState } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { DateRangeContext } from '../context/DateRangeContext';

const Home = () => {
  const { dataInicio, dataFim, setDataInicio, setDataFim } = useContext(DateRangeContext);
  const [validationError, setValidationError] = useState('');

  const isInvalidRange = useMemo(() => {
    if (!dataInicio || !dataFim) return false;
    const start = new Date(dataInicio);
    const end = new Date(dataFim);
    return start > end;
  }, [dataInicio, dataFim]);

  const handleChangeInicio = (value) => {
    setDataInicio(value);
    setValidationError('');
  };

  const handleChangeFim = (value) => {
    setDataFim(value);
    setValidationError('');
  };

  const handleValidate = () => {
    if (isInvalidRange) {
      setValidationError('A data de início não pode ser maior que a data de fim.');
      return;
    }
    setValidationError('');
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 text-center">
          <h1 className="text-6xl font-light mb-2 text-gray-800 mb-6">Bem-vindo</h1>
          <p className="text-gray-900 font-bold mb-20 text-lg tracking-wide">VARIAVEL DE DISTRIBUIÇÃO</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h2 className="text-lg font-semibold mb-2 text-gray-800 mb-4 text-center">Filtro Global de Datas</h2>

          <div className="flex flex-wrap gap-3 items-end justify-center">
            <div>
              <label htmlFor="global-data-inicio" className="block text-xs text-gray-500 mb-1">Início</label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 text-gray-400" size={16} />
                <input
                  id="global-data-inicio"
                  type="date"
                  className="pl-8 pr-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
                  value={dataInicio}
                  onChange={(e) => handleChangeInicio(e.target.value)}
                  onBlur={handleValidate}
                />
              </div>
            </div>

            <div>
              <label htmlFor="global-data-fim" className="block text-xs text-gray-500 mb-1">Fim</label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 text-gray-400" size={16} />
                <input
                  id="global-data-fim"
                  type="date"
                  className="pl-8 pr-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
                  value={dataFim}
                  onChange={(e) => handleChangeFim(e.target.value)}
                  onBlur={handleValidate}
                />
              </div>
            </div>
          </div>

          {(validationError || isInvalidRange) && (
            <div className="mt-4 bg-yellow-50 text-yellow-800 p-3 rounded-lg border border-yellow-100 flex gap-2 items-start justify-center">
              <AlertCircle className="mt-0.5" size={18} />
              <div>{validationError || 'Intervalo inválido. Ajuste as datas.'}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
