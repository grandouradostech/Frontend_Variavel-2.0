import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { Package, Download } from 'lucide-react';
import { DateRangeContext } from '../context/DateRangeContext';
import { AuthContext } from '../context/AuthContext';
import * as XLSX from 'xlsx';

const Caixas = () => {
  const { dataInicio, dataFim } = useContext(DateRangeContext);
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('motoristas');
  const [loading, setLoading] = useState(false);
  const [dados, setDados] = useState({ motoristas: [], ajudantes: [] });
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  const fetchDados = useCallback(async () => {
    if (dataInicio && dataFim && new Date(dataInicio) > new Date(dataFim)) {
      setValidationError('A data de início não pode ser maior que a data de fim.');
      return;
    }

    setValidationError('');
    setLoading(true);
    setError('');

    try {
      // Passar datas explicitamente para evitar duplicação com o interceptor
      const params = {};
      if (dataInicio) params.data_inicio = dataInicio;
      if (dataFim) params.data_fim = dataFim;

      const response = await api.get('/caixas', { params });
      if (response?.data?.error) {
        setDados({ motoristas: [], ajudantes: [] });
        setError(String(response.data.error));
        return;
      }

      setDados(response?.data || { motoristas: [], ajudantes: [] });
    } catch (err) {
      setError('Erro ao carregar dados. Verifique se o Backend está a correr.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [dataFim, dataInicio]);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  useEffect(() => {
    if (user?.role !== 'colaborador') return;
    const mLen = Array.isArray(dados.motoristas) ? dados.motoristas.length : 0;
    const aLen = Array.isArray(dados.ajudantes) ? dados.ajudantes.length : 0;
    if (mLen > 0 && aLen === 0) setActiveTab('motoristas');
    if (aLen > 0 && mLen === 0) setActiveTab('ajudantes');
  }, [dados.ajudantes, dados.motoristas, user?.role]);

  const listaAtual = useMemo(() => {
    return activeTab === 'motoristas' ? dados.motoristas || [] : dados.ajudantes || [];
  }, [activeTab, dados.ajudantes, dados.motoristas]);

  const formatMoney = (value) => {
  const v = parseFloat(value) || 0;
  return v.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

  const handleExport = useCallback(() => {
    const mot = Array.isArray(dados.motoristas) ? dados.motoristas : [];
    const ajd = Array.isArray(dados.ajudantes) ? dados.ajudantes : [];

    if (mot.length === 0 && ajd.length === 0) {
      alert('Não há dados para exportar.');
      return;
    }

    const mapRow = (item) => ({
      CPF: item.cpf || '',
      COD: item.cod ?? '',
      NOME: item.nome || '',
      ANTIGUIDADE: item.antiguidade_dias ?? 0,
      TOTAL_CAIXAS: parseFloat(item.total_caixas) || 0,
      VALOR_POR_CX: parseFloat(item.valor_por_caixa) || 0,
      PONTOS_TOTAL: parseFloat(item.total_premio) || 0,
    });

    const wsMotoristas = XLSX.utils.json_to_sheet(mot.map(mapRow), {
      header: ['CPF', 'COD', 'NOME', 'ANTIGUIDADE', 'TOTAL_CAIXAS', 'VALOR_POR_CX', 'PONTOS_TOTAL'],
      skipHeader: false,
    });
    const wsAjudantes = XLSX.utils.json_to_sheet(ajd.map(mapRow), {
      header: ['CPF', 'COD', 'NOME', 'ANTIGUIDADE', 'TOTAL_CAIXAS', 'VALOR_POR_CX', 'PONTOS_TOTAL'],
      skipHeader: false,
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsMotoristas, 'Motoristas');
    XLSX.utils.book_append_sheet(wb, wsAjudantes, 'Ajudantes');

    const nomeArquivo = `bonus_caixas_${dataInicio || 'sem_data'}_${dataFim || 'sem_data'}.xlsx`;
    XLSX.writeFile(wb, nomeArquivo);
  }, [dados.ajudantes, dados.motoristas, dataFim, dataInicio]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-blue-600" />
            Bónus Caixas
          </h1>
          <p className="text-sm text-gray-500">Cálculo baseado na antiguidade e volume de caixas.</p>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-stretch sm:items-end w-full md:w-auto">
          <button
            onClick={handleExport}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium h-[38px] flex gap-2 items-center justify-center w-full sm:w-auto"
            title="Exportar"
          >
            <Download size={16} /> Exportar
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('motoristas')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'motoristas' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Motoristas
        </button>
        <button
          onClick={() => setActiveTab('ajudantes')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'ajudantes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Ajudantes
        </button>
      </div>

      {validationError && (
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg border border-yellow-200">{validationError}</div>
      )}

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">{error}</div>}

      <div className="md:hidden space-y-3">
        {listaAtual.length > 0 ? (
          listaAtual.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-gray-800">{item.nome || '-'}</div>
                  <div className="text-xs text-gray-500">
                    CPF: {item.cpf || '-'} • CÓD: <span className="font-mono">{item.cod ?? '-'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">PONTOS</div>
                  <div className="font-bold text-green-700">{formatMoney(item.total_premio)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="text-xs text-gray-500">Antiguidade</div>
                  <div className="font-semibold text-gray-800">{item.antiguidade_dias ?? 0} dias</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="text-xs text-gray-500">Total caixas</div>
                  <div className="font-semibold text-gray-800">
                    {(parseFloat(item.total_caixas) || 0).toLocaleString('pt-BR')}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="text-xs text-gray-500">Valor / cx</div>
                  <div className="font-semibold text-gray-800">{formatMoney(item.valor_por_caixa)}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="text-xs text-gray-500">PONTOS TOTAL</div>
                  <div className="font-semibold text-gray-800">{formatMoney(item.total_premio)}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center text-gray-500">
            {loading ? 'A carregar dados...' : 'Nenhum registo encontrado para este período.'}
          </div>
        )}
      </div>

      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">CPF</th>
                <th className="px-6 py-4 font-semibold text-gray-700">CÓD</th>
                <th className="px-6 py-4 font-semibold text-gray-700">NOME</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-center">ANTIGUIDADE</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-right">TOTAL CAIXAS</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-right">VALOR / CX</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-right">PONTOS TOTAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    A carregar dados...
                  </td>
                </tr>
              ) : listaAtual.length > 0 ? (
                listaAtual.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-600">{item.cpf}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono">{item.cod}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{item.nome}</td>
                    <td className="px-6 py-4 text-gray-600 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          (parseFloat(item.antiguidade_dias) || 0) > 0 ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {item.antiguidade_dias ?? 0} dias
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-800 text-right font-medium">
                      <span className="inline-block text-center w-full">{(parseFloat(item.total_caixas) || 0).toLocaleString('pt-BR')}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-center">{formatMoney(item.valor_por_caixa)}</td>
                    <td className="px-6 py-4 text-right font-bold text-green-600">{formatMoney(item.total_premio)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    Nenhum registo de {activeTab === 'motoristas' ? 'motoristas' : 'ajudantes'} encontrado para este período.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Caixas;
