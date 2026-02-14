import { useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { Download, AlertCircle, Wallet } from 'lucide-react';
import { DateRangeContext } from '../context/DateRangeContext';

const Pagamento = () => {
  const { dataInicio, dataFim } = useContext(DateRangeContext);
  const [data, setData] = useState({ motoristas: [], ajudantes: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('motoristas');

  // Carregar dados
  const fetchPagamento = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/pagamento');
      
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setData({
            motoristas: response.data.motoristas || [],
            ajudantes: response.data.ajudantes || []
        });
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar resumo de pagamento.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagamento();
  }, [dataInicio, dataFim]);

  // Função para Download do Excel
  const handleExport = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        alert("Erro de autenticação. Faça login novamente.");
        return;
    }
    
    try {
      const response = await api.get('/pagamento/exportar', {
        responseType: 'blob', // Importante para receber o arquivo binário
      });

      // Cria um link temporário para download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio_pagamento_${dataInicio}_${dataFim}.xlsx`);
      document.body.appendChild(link);
      link.click();
      
      // Limpeza
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Erro ao exportar:", err);
      alert("Erro ao exportar o relatório. Verifique se há dados para o período.");
    }
  };

  const formatMoney = (val) => {
      const v = parseFloat(val) || 0;
      return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const listaAtual = activeTab === 'motoristas' ? data.motoristas : data.ajudantes;

  // Totais do rodapé
  const totalGeral = listaAtual.reduce((acc, item) => acc + (parseFloat(item.total_a_pagar) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Wallet className="text-green-600" />
            Resumo de Pagamento
          </h1>
          <p className="text-gray-500 text-sm">Consolidado de Produção (Caixas) + Qualidade (KPIs)</p>
        </div>

        <div className="flex flex-wrap gap-2 items-end">
            <button 
                onClick={fetchPagamento}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium h-[38px]"
            >
                Calcular
            </button>
            <button 
                onClick={handleExport}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium h-[38px] flex items-center gap-2"
                title="Baixar Excel"
            >
                <Download size={18} />
                Exportar
            </button>
        </div>
      </div>

      {/* Abas */}
      <div className="flex gap-2 border-b border-gray-200">
         <button
            onClick={() => setActiveTab('motoristas')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'motoristas' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
         >
            Motoristas
         </button>
         <button
            onClick={() => setActiveTab('ajudantes')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'ajudantes' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
         >
            Ajudantes
         </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
              <tr>
                <th className="py-3 px-4">Colaborador</th>
                <th className="py-3 px-4 text-right">Prêmio Caixas</th>
                <th className="py-3 px-4 text-right">Prêmio KPIs</th>
                <th className="py-3 px-4 text-right font-bold text-gray-800 bg-gray-50 w-40">Total a Pagar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="4" className="py-12 text-center text-gray-500">Calculando pagamentos...</td></tr>
              ) : listaAtual.length === 0 ? (
                <tr><td colSpan="4" className="py-12 text-center text-gray-500">Nenhum dado encontrado para o período. Clique em "Calcular".</td></tr>
              ) : (
                <>
                    {listaAtual.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                            <div className="font-medium text-gray-800">{row.nome || `COD ${row.cod}`}</div>
                            <div className="text-xs text-gray-400">CPF: {row.cpf || '-'}</div>
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600">
                            {formatMoney(row.premio_caixas)}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600">
                            {formatMoney(row.premio_kpi)}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-green-700 bg-gray-50 border-l border-gray-100 text-base">
                            {formatMoney(row.total_a_pagar)}
                        </td>
                    </tr>
                    ))}
                    {/* Linha de Total */}
                    <tr className="bg-gray-100 font-bold border-t border-gray-200">
                        <td className="py-3 px-4 text-gray-700">TOTAIS</td>
                        <td className="py-3 px-4 text-right">-</td>
                        <td className="py-3 px-4 text-right">-</td>
                        <td className="py-3 px-4 text-right text-green-800 text-lg">
                            {formatMoney(totalGeral)}
                        </td>
                    </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Pagamento;
