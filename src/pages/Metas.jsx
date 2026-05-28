import { useState, useEffect } from 'react';
import api from '../services/api';
import { Save, Settings, DollarSign, Target, AlertCircle, CheckCircle } from 'lucide-react';

const Metas = () => {
  const [metas, setMetas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('motorista');

  useEffect(() => {
    fetchMetas();
  }, []);

  const fetchMetas = async () => {
    try {
      const response = await api.get('/metas/');
      setMetas(response.data);
    } catch (err) {
      setError('Erro ao carregar metas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (categoria, campo, valor) => {
    setMetas(prev => ({
      ...prev,
      [categoria]: {
        ...prev[categoria],
        [campo]: parseFloat(valor) || 0
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/metas/', metas);
      setSuccess('Metas atualizadas com sucesso!');
      // Limpa a mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar metas. Verifique se você é administrador.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando configurações...</div>;

  const renderInput = (label, categoria, campo, type = "money") => (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-2.5 text-gray-400">
            {type === "money" ? <DollarSign size={16} /> : <Target size={16} />}
        </div>
        <input
          type="number"
          step={type === "money" ? "0.01" : "0.01"}
          value={metas?.[categoria]?.[campo] || 0}
          onChange={(e) => handleChange(categoria, campo, e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-gray-700"
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Settings className="text-gray-600" />
                Painel de Gestão
            </h1>
            <p className="text-gray-500 text-sm">Configure os valores de premiação e metas operacionais</p>
        </div>
        <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white transition-colors shadow-md ${saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
            {saving ? 'Salvando...' : <><Save size={18} /> Salvar Alterações</>}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 flex items-center gap-2">
          <AlertCircle size={20} /> {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-100 flex items-center gap-2">
          <CheckCircle size={20} /> {success}
        </div>
      )}

      {/* Abas */}
      <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-fit">
         {['motorista', 'ajudante'].map((role) => (
             <button
                key={role}
                onClick={() => setActiveTab(role)}
                className={`px-6 py-2 text-sm font-bold rounded-lg transition-all capitalize ${
                    activeTab === role 
                    ? 'bg-blue-50 text-blue-700 shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
             >
                {role}
             </button>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card KPIs */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Indicadores (KPIs)</h3>
            <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                    {renderInput("Meta Devolução (%)", activeTab, "dev_pdv_meta_perc", "perc")}
                    {renderInput("Prêmio Devolução (R$)", activeTab, "dev_pdv_premio", "money")}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {renderInput("Meta Rating (%)", activeTab, "rating_meta_perc", "perc")}
                    {renderInput("Prêmio Rating (R$)", activeTab, "rating_premio", "money")}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {renderInput("Meta Refugo (%)", activeTab, "refugo_meta_perc", "perc")}
                    {renderInput("Prêmio Refugo (R$)", activeTab, "refugo_premio", "money")}
                </div>
            </div>
        </div>

        {/* Card Caixas (Antiguidade) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Variável Caixas (Antiguidade)</h3>
            <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Nível 1 (Recém-contratado)</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {renderInput("Até dias", activeTab, "meta_cx_dias_n1", "number")}
                        {renderInput("Valor p/ Caixa", activeTab, "meta_cx_valor_n1", "money")}
                    </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <h4 className="font-semibold text-sm text-blue-800 mb-2">Nível 2 (Intermédio)</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {renderInput("Até dias", activeTab, "meta_cx_dias_n2", "number")}
                        {renderInput("Valor p/ Caixa", activeTab, "meta_cx_valor_n2", "money")}
                    </div>
                </div>

                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                    <h4 className="font-semibold text-sm text-indigo-800 mb-2">Nível 3 (Sênior)</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {renderInput("Até dias", activeTab, "meta_cx_dias_n3", "number")}
                        {renderInput("Valor p/ Caixa", activeTab, "meta_cx_valor_n3", "money")}
                    </div>
                </div>
                
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <h4 className="font-semibold text-sm text-purple-800 mb-2">Nível 4 (Veterano)</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center text-sm text-gray-500 pt-6">Acima do Nível 3</div>
                        {renderInput("Valor p/ Caixa", activeTab, "meta_cx_valor_n4", "money")}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Metas;