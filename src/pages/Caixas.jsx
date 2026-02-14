import { useState, useEffect, useCallback, useContext } from 'react';
import api from '../services/api';
<<<<<<< HEAD
import { Search, Package } from 'lucide-react';
import { DateRangeContext } from '../context/DateRangeContext';
import { AuthContext } from '../context/AuthContext';

const Caixas = () => {
  const { dataInicio, dataFim } = useContext(DateRangeContext);
  const { user } = useContext(AuthContext);
=======
import { Calendar, Search, Package } from 'lucide-react';
import { useFilters } from '../context/FilterContext'; // <--- IMPORTAR CONTEXTO

const Caixas = () => {
  const { filters, setFilters, updateCache, getCachedData } = useFilters(); // <--- USAR CONTEXTO
  const [activeTab, setActiveTab] = useState('motoristas');
>>>>>>> 725bf39c07d041b12c30db695b890b2c33c1b67e
  const [loading, setLoading] = useState(false);
  const [dados, setDados] = useState({ motoristas: [], ajudantes: [] });
  const [activeTab, setActiveTab] = useState('motoristas');
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  // Função para buscar dados da API
<<<<<<< HEAD
  const fetchDados = useCallback(async () => {
    if (new Date(dataInicio) > new Date(dataFim)) {
=======
  const fetchDados = async (force = false) => {
    if (new Date(filters.start) > new Date(filters.end)) {
>>>>>>> 725bf39c07d041b12c30db695b890b2c33c1b67e
      setValidationError('A data de início não pode ser maior que a data de fim.');
      return;
    }

    // Verifica Cache antes de buscar
    if (!force) {
        const cached = getCachedData('caixas');
        if (cached) {
            setDados(cached);
            return;
        }
    }

    setValidationError('');
    setLoading(true);
    setError('');
    
    try {
<<<<<<< HEAD
      const response = await api.get('/caixas');
      if (response?.data?.error) {
        setDados({ motoristas: [], ajudantes: [] });
        setError(String(response.data.error));
        return;
      }
      setDados(response.data || { motoristas: [], ajudantes: [] });
=======
      const response = await api.get('/caixas', {
        params: { 
          data_inicio: filters.start, 
          data_fim: filters.end 
        }
      });
      setDados(response.data);
      updateCache('caixas', response.data); // Salva no cache
>>>>>>> 725bf39c07d041b12c30db695b890b2c33c1b67e
    } catch (err) {
      setError('Erro ao carregar dados. Verifique se o Backend está a correr.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [dataFim, dataInicio]);

  // Carrega os dados ao abrir a página ou mudar filtros
  useEffect(() => {
    fetchDados();
<<<<<<< HEAD
  }, [fetchDados]);

  useEffect(() => {
    if (user?.role !== 'colaborador') return;
    const mLen = Array.isArray(dados.motoristas) ? dados.motoristas.length : 0;
    const aLen = Array.isArray(dados.ajudantes) ? dados.ajudantes.length : 0;
    if (mLen > 0 && aLen === 0) setActiveTab('motoristas');
    if (aLen > 0 && mLen === 0) setActiveTab('ajudantes');
  }, [dados.ajudantes, dados.motoristas, user?.role]);

  const listaAtual = activeTab === 'motoristas' ? (dados.motoristas || []) : (dados.ajudantes || []);
=======
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]); // Reage a mudanças no filtro global

  const handleDateChange = (field, value) => {
      setFilters(prev => ({ ...prev, [field]: value }));
  };

  const listaAtual = activeTab === 'motoristas' ? dados.motoristas : dados.ajudantes;
>>>>>>> 725bf39c07d041b12c30db695b890b2c33c1b67e

  return (
    <div className="space-y-6">
      {/* Cabeçalho e Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-blue-600" />
            Bónus Caixas
          </h1>
          <p className="text-sm text-gray-500">Cálculo baseado na antiguidade e volume de caixas.</p>
        </div>

<<<<<<< HEAD
        <div className="flex gap-2 items-end w-full md:w-auto">
=======
        <div className="flex flex-wrap gap-2 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">De:</label>
            <div className="relative">
              <Calendar className="absolute left-2 top-2.5 text-gray-400" size={16} />
              <input 
                type="date" 
                value={filters.start}
                onChange={(e) => handleDateChange('start', e.target.value)}
                className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Até:</label>
            <div className="relative">
              <Calendar className="absolute left-2 top-2.5 text-gray-400" size={16} />
              <input 
                type="date" 
                value={filters.end}
                onChange={(e) => handleDateChange('end', e.target.value)}
                className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
>>>>>>> 725bf39c07d041b12c30db695b890b2c33c1b67e
          <button 
            onClick={() => fetchDados(true)}
            disabled={loading}
<<<<<<< HEAD
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 w-full md:w-auto"
            aria-label="Filtrar resultados"
=======
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors disabled:opacity-50 h-[38px]"
>>>>>>> 725bf39c07d041b12c30db695b890b2c33c1b67e
          >
            <Search size={18} />
            {loading ? 'A carregar...' : 'Filtrar'}
          </button>
        </div>
      </div>

<<<<<<< HEAD
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
=======
      {/* --- SELEÇÃO DE TIPO (MOTORISTA / AJUDANTE) --- */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit shadow-inner">
        <button
            onClick={() => setActiveTab('motoristas')}
            className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${
                activeTab === 'motoristas' 
                ? 'bg-white shadow text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
        >
            Motoristas
        </button>
        <button
            onClick={() => setActiveTab('ajudantes')}
            className={`px-6 py-2 text-sm font-bold rounded-md transition-all ${
                activeTab === 'ajudantes' 
                ? 'bg-white shadow text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
        >
            Ajudantes
        </button>
      </div>

>>>>>>> 725bf39c07d041b12c30db695b890b2c33c1b67e
      {validationError && (
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg border border-yellow-200">
          {validationError}
        </div>
      )}

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
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${item.antiguidade_dias > 0 ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                        {item.antiguidade_dias} dias
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-800 text-right font-medium">
                      {(parseFloat(item.total_caixas) || 0).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-right">
<<<<<<< HEAD
                      R$ {(parseFloat(item.valor_por_caixa) || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-green-600">
                      R$ {(parseFloat(item.total_premio) || 0).toFixed(2)}
=======
                      {item.valor_por_caixa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-green-600">
                      {item.total_premio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
>>>>>>> 725bf39c07d041b12c30db695b890b2c33c1b67e
                    </td>
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
