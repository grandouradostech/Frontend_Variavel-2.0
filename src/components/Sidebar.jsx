import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Package, 
  FileText, 
  Target, 
  LogOut,
  User
} from 'lucide-react';
import React, { memo } from 'react';

const Sidebar = memo(() => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Função para definir a classe do link (ativo ou inativo)
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
      isActive 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 flex flex-col p-6">
      {/* Cabeçalho da Sidebar */}
      <div className="flex items-center gap-3 pb-6 border-b border-gray-100 mb-6">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
          <User size={20} />
        </div>
        <div>
          <h2 className="font-bold text-gray-800 leading-tight">Sistema de Gestão</h2>
          <p className="text-xs text-gray-500">Dashboard Principal</p>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 flex flex-col gap-2">
        <NavLink to="/dashboard" className={linkClass}>
          <LayoutDashboard size={20} />
          <span>Visão Geral (Xadrez)</span>
        </NavLink>

        <NavLink to="/incentivo" className={linkClass}>
          <TrendingUp size={20} />
          <span>Incentivo (KPIs)</span>
        </NavLink>

        <NavLink to="/caixas" className={linkClass}>
          <Package size={20} />
          <span>Bónus Caixas</span>
        </NavLink>

        {/* Apenas mostra o resumo de pagamento e metas se for Admin */}
        {user?.role === 'admin' && (
          <>
            <NavLink to="/pagamento" className={linkClass}>
              <FileText size={20} />
              <span>Resumo Pagamento</span>
            </NavLink>

            <NavLink to="/metas" className={linkClass}>
              <Target size={20} />
              <span>Painel de Gestão</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* Rodapé da Sidebar */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors w-full font-medium"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
});

export default Sidebar;