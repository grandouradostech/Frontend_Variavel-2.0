import { useState, useEffect, useCallback, useContext } from 'react';
import api from '../services/api';
import { Search, Package } from 'lucide-react';
import { DateRangeContext } from '../context/DateRangeContext';
import { AuthContext } from '../context/AuthContext';

const Caixas = () => {
  const { dataInicio, dataFim } = useContext(DateRangeContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [dados, setDados] = useState({ motoristas: [], ajudantes: [] });
  const [activeTab, setActiveTab] = useState('motoristas');
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState(''); // Validation error state

  // Função para buscar dados da API
  const fetchDados = useCallback(async () => {
    if (new Date(dataInicio) > new Date(dataFim)) {
      setValidationError('A data de início não pode ser maior que a data de fim.');
      return;
    }

    setValidationError(''); // Clear validation error
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/caixas');
      if (response?.data?.error) {
        setDados({ motoristas: [], ajudantes: [] });
        setError(String(response.data.error));
        return;
      }
      setDados(response.data || { motoristas: [], ajudantes: [] });
    } catch (err) {
      setError('Erro ao carregar dados. Verifique se o Backend está a correr.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [dataFim, dataInicio]);

  // Carrega os dados ao abrir a página
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

  const listaAtual = activeTab === 'motoristas' ? (dados.motoristas || []) : (dados.ajudantes || []);

  return (
    <div className="space-y-6">
      {/* Cabeçalho e Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-blue-600" />
            Bónus Caixas
          </h1>
          <p className="text-sm text-gray-500">Cálculo baseado na antiguidade e volume de caixas.</p>
        </div>

        <div className="flex gap-2 items-end w-full md:w-auto">
          <button 
            onClick={fetchDados}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 w-full md:w-auto"
            aria-label="Filtrar resultados"
          >
            <Search size={18} />
            {loading ? 'A carregar...' : 'Filtrar'}
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('motoristas')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'motoristas'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Motoristas
        </button>
        <button
          onClick={() => setActiveTab('ajudantes')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'ajudantes'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Ajudantes
        </button>
      </div>

      {/* Validation Error Message */}
      {validationError && (
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg border border-yellow-200">
          {validationError}
        </div>
      )}

      {/* Mensagem de Erro */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

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
                  <div className="text-xs text-gray-500">Prémio</div>
                  <div className="font-bold text-green-700">
                    R$ {(parseFloat(item.total_premio) || 0).toFixed(2)}
                  </div>
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
                  <div className="font-semibold text-gray-800">
                    R$ {(parseFloat(item.valor_por_caixa) || 0).toFixed(2)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="text-xs text-gray-500">Prémio total</div>
                  <div className="font-semibold text-gray-800">
                    R$ {(parseFloat(item.total_premio) || 0).toFixed(2)}
                  </div>
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
                <th className="px-6 py-4 font-semibold text-gray-700 text-right">PRÉMIO TOTAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listaAtual.length > 0 ? (
                listaAtual.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-600">{item.cpf}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono">{item.cod}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{item.nome}</td>
                    <td className="px-6 py-4 text-gray-600 text-center">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                        {item.antiguidade_dias} dias
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-800 text-right font-medium">
                      {(parseFloat(item.total_caixas) || 0).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-right">
                      R$ {(parseFloat(item.valor_por_caixa) || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-green-600">
                      R$ {(parseFloat(item.total_premio) || 0).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    {loading ? 'A carregar dados...' : 'Nenhum registo encontrado para este período.'}
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
