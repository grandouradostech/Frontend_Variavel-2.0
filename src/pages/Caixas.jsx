import { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, Search, Package, Truck, Users } from 'lucide-react';

const Caixas = () => {
  // Datas padrão (Dia 1 do mês até hoje)
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const currentDay = today.toISOString().split('T')[0];

  const [dataInicio, setDataInicio] = useState(firstDay);
  const [dataFim, setDataFim] = useState(currentDay);
  const [activeTab, setActiveTab] = useState('motoristas');
  const [loading, setLoading] = useState(false);
  const [dados, setDados] = useState({ motoristas: [], ajudantes: [] });
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState(''); // Validation error state

  // Função para buscar dados da API
  const fetchDados = async () => {
    if (new Date(dataInicio) > new Date(dataFim)) {
      setValidationError('A data de início não pode ser maior que a data de fim.');
      return;
    }

    setValidationError(''); // Clear validation error
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/caixas', {
        params: { 
          data_inicio: dataInicio, 
          data_fim: dataFim 
        }
      });
      setDados(response.data);
    } catch (err) {
      setError('Erro ao carregar dados. Verifique se o Backend está a correr.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Carrega os dados ao abrir a página
  useEffect(() => {
    fetchDados();
  }, []);

  // Define a lista a exibir com base na aba selecionada
  const listaAtual = activeTab === 'motoristas' ? dados.motoristas : dados.ajudantes;

  return (
    <div className="space-y-6">
      {/* Cabeçalho e Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-blue-600" />
            Bónus Caixas
          </h1>
          <p className="text-sm text-gray-500">Cálculo baseado na antiguidade e volume de caixas.</p>
        </div>

        <div className="flex gap-2 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">De:</label>
            <div className="relative">
              <Calendar className="absolute left-2 top-2.5 text-gray-400" size={16} />
              <input 
                type="date" 
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                aria-label="Data de início"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Até:</label>
            <div className="relative">
              <Calendar className="absolute left-2 top-2.5 text-gray-400" size={16} />
              <input 
                type="date" 
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                aria-label="Data de fim"
              />
            </div>
          </div>
          <button 
            onClick={fetchDados}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors disabled:opacity-50"
            aria-label="Filtrar resultados"
          >
            <Search size={18} />
            {loading ? 'A carregar...' : 'Filtrar'}
          </button>
        </div>
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

      {/* Tabela de Dados */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                      {item.total_caixas.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-right">
                      R$ {item.valor_por_caixa.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-green-600">
                      R$ {item.total_premio.toFixed(2)}
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