import React, { useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { Search, Package, Download, AlertCircle } from 'lucide-react';
import { DateRangeContext } from '../context/DateRangeContext';

const formatDatePtBr = (isoDate) => {
  if (!isoDate) return '';
  const datePart = String(isoDate).split('T')[0];
  const [yyyy, mm, dd] = datePart.split('-');
  if (!yyyy || !mm || !dd) return '';
  return `${dd}/${mm}/${yyyy}`;
};

const Xadrez = () => {
  const { dataInicio, dataFim } = useContext(DateRangeContext);
  const [busca, setBusca] = useState('');
  const [viagens, setViagens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const carregarXadrez = async () => {
    if (dataInicio && dataFim && new Date(dataInicio) > new Date(dataFim)) {
      setErrorMsg('A data de início não pode ser maior que a data de fim.');
      setViagens([]);
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const response = await api.get('/xadrez/detalhado');

      if (Array.isArray(response.data)) {
        setViagens(response.data);
      } else {
        setViagens([]);
        setErrorMsg('Resposta inesperada do servidor.');
      }
    } catch (error) {
      console.error('Erro:', error);
      const status = error?.response?.status;
      if (status === 401) setErrorMsg('Sessão expirada. Faça login novamente.');
      else if (status === 403) setErrorMsg('Acesso negado para este recurso.');
      else setErrorMsg('Falha ao conectar com o servidor.');
      setViagens([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarXadrez();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataInicio, dataFim]);

  const viagensFiltradas = useMemo(() => {
    if (!busca) return viagens;
    const termo = busca.toLowerCase();

    return viagens.filter((item) => {
      const motorista = String(item.MOTORISTA || '').toLowerCase();
      const motorista2 = String(item.MOTORISTA_2 || '').toLowerCase();
      const ajudante1 = String(item.AJUDANTE_1 || '').toLowerCase();
      const ajudante2 = String(item.AJUDANTE_2 || '').toLowerCase();
      const ajudante3 = String(item.AJUDANTE_3 || '').toLowerCase();
      const mapa = String(item.MAPA || '').toLowerCase();

      return (
        motorista.includes(termo) ||
        motorista2.includes(termo) ||
        ajudante1.includes(termo) ||
        ajudante2.includes(termo) ||
        ajudante3.includes(termo) ||
        mapa.includes(termo)
      );
    });
  }, [busca, viagens]);

  const handleExport = () => {
    if (!viagensFiltradas.length) {
      alert('Não há dados para exportar.');
      return;
    }

    const headers = [
      'DATA',
      'MAPA',
      'CAIXAS_TOTAL',
      'COD_MOTORISTA',
      'NOME_MOTORISTA',
      'COD_AJUDANTE_1',
      'NOME_AJUDANTE_1',
      'COD_AJUDANTE_2',
      'NOME_AJUDANTE_2',
      'COD_AJUDANTE_3',
      'NOME_AJUDANTE_3',
    ];

    const rows = viagensFiltradas.map((item) => {
      const fields = [
        formatDatePtBr(item.DATA),
        item.MAPA || '',
        item.CAIXAS_TOTAL ?? 0,
        item.COD ?? '',
        item.MOTORISTA || '',
        item.CODJ_1 ?? '',
        item.AJUDANTE_1 || '',
        item.CODJ_2 ?? '',
        item.AJUDANTE_2 || '',
        item.CODJ_3 ?? '',
        item.AJUDANTE_3 || '',
      ];
      return fields.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `xadrez_${dataInicio}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Package className="text-blue-600" size={24} />
              Xadrez de Entregas
            </h1>
            <p className="text-sm text-gray-500">Consulta de Mapas e Produção</p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-stretch sm:items-end w-full md:w-auto">
            <button
              onClick={carregarXadrez}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium h-[38px] w-full sm:w-auto"
            >
              Atualizar
            </button>
            <button
              onClick={handleExport}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium h-[38px] flex gap-2 items-center justify-center w-full sm:w-auto"
            >
              <Download size={16} /> Exportar CSV
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por motorista, ajudante ou mapa..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 flex gap-2 items-start">
          <AlertCircle className="mt-0.5" size={18} />
          <div>{errorMsg}</div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="md:hidden space-y-3">
        {!loading && viagensFiltradas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center text-gray-500">
            Nenhum registro encontrado para o período.
          </div>
        ) : (
          viagensFiltradas.map((item) => (
            <div key={`${item.MAPA}-${item.DATA}`} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-gray-500">{formatDatePtBr(item.DATA)}</div>
                  <div className="font-semibold text-gray-800">Mapa {item.MAPA || '-'}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Caixas</div>
                  <div className="font-bold text-gray-800">{Number(item.CAIXAS_TOTAL || 0).toFixed(0)}</div>
                  <div className="mt-1 text-xs text-gray-500">Devolução</div>
                  <div className="font-semibold text-gray-800">{Number(item.CAIXAS_DEVOLVIDAS || 0).toFixed(0)}</div>
                </div>
              </div>

              <div className="mt-3 space-y-2 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Motorista 1</div>
                  <div className="text-gray-800">
                    {item.COD ? `${item.COD} - ${item.MOTORISTA || ''}` : item.MOTORISTA || '-'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Motorista 2</div>
                  <div className="text-gray-800">
                    {item.COD_2 ? `${item.COD_2} - ${item.MOTORISTA_2 || ''}` : item.MOTORISTA_2 || '-'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Ajudantes</div>
                  <div className="text-gray-800">
                    <div>{item.CODJ_1 ? `${item.CODJ_1} - ${item.AJUDANTE_1 || ''}` : item.AJUDANTE_1 || '-'}</div>
                    <div>{item.CODJ_2 ? `${item.CODJ_2} - ${item.AJUDANTE_2 || ''}` : item.AJUDANTE_2 || '-'}</div>
                    <div>{item.CODJ_3 ? `${item.CODJ_3} - ${item.AJUDANTE_3 || ''}` : item.AJUDANTE_3 || '-'}</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
              <tr>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Mapa</th>
                <th className="py-3 px-4">Caixas Total</th>
                <th className="py-3 px-4">Devolução</th>
                <th className="py-3 px-4">Motorista 1</th>
                <th className="py-3 px-4">Motorista 2</th>
                <th className="py-3 px-4">Ajudante 1</th>
                <th className="py-3 px-4">Ajudante 2</th>
                <th className="py-3 px-4">Ajudante 3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!loading && viagensFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-gray-500">
                    Nenhum registro encontrado para o período.
                  </td>
                </tr>
              ) : (
                viagensFiltradas.map((item) => (
                  <tr key={`${item.MAPA}-${item.DATA}`} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-700">{formatDatePtBr(item.DATA)}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{item.MAPA}</td>
                    <td className="py-3 px-4 text-gray-700">{Number(item.CAIXAS_TOTAL || 0).toFixed(0)}</td>
                    <td className="py-3 px-4 text-gray-700">{Number(item.CAIXAS_DEVOLVIDAS || 0).toFixed(0)}</td>
                    <td className="py-3 px-4 text-gray-700">
                      {item.COD ? `${item.COD} - ${item.MOTORISTA || ''}` : item.MOTORISTA || '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {item.COD_2 ? `${item.COD_2} - ${item.MOTORISTA_2 || ''}` : item.MOTORISTA_2 || '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {item.CODJ_1 ? `${item.CODJ_1} - ${item.AJUDANTE_1 || ''}` : item.AJUDANTE_1 || '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {item.CODJ_2 ? `${item.CODJ_2} - ${item.AJUDANTE_2 || ''}` : item.AJUDANTE_2 || '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {item.CODJ_3 ? `${item.CODJ_3} - ${item.AJUDANTE_3 || ''}` : item.AJUDANTE_3 || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Xadrez;

