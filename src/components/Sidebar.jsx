import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  TrendingUp, 
  Package, 
  FileText, 
  Target, 
  LogOut,
  User,
  Home,
  X
} from 'lucide-react';
import React, { memo } from 'react';

const Sidebar = memo(({ mobileOpen = false, onClose }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  // Função para definir a classe do link (ativo ou inativo)
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
      isActive 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-gray-900/40 z-40 md:hidden"
          onClick={onClose}
          aria-label="Fechar menu"
        />
      )}

      <div
        className={`w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 flex flex-col p-6 z-50 transform transition-transform duration-200 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
      {/* Cabeçalho da Sidebar */}
      <div className="flex items-center gap-3 pb-6 border-b border-gray-100 mb-6">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
            <User size={20} />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-gray-800 leading-tight">Variavel Distribuição</h2>
            <p className="text-xs text-gray-500">Dashboard Principal</p>
          </div>
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-700"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>

      {/* Navegação */}
      <nav className="flex-1 flex flex-col gap-2">
        <NavLink to="/home" className={linkClass} onClick={onClose}>
          <Home size={20} />
          <span>Início</span>
        </NavLink>

        <NavLink to="/xadrez" className={linkClass} onClick={onClose}>
          <Package size={20} />
          <span>Xadrez</span>
        </NavLink>

        <NavLink to="/caixas" className={linkClass} onClick={onClose}>
          <Package size={20} />
          <span>Bónus Caixas</span>
        </NavLink>

        {/* Apenas mostra o resumo de pagamento e metas se for Admin */}
        {user?.role === 'admin' && (
          <>
            {/* <NavLink to="/incentivo" className={linkClass} onClick={onClose}>
              <TrendingUp size={20} />
              <span>Incentivo (KPIs)</span>
            </NavLink>

            <NavLink to="/pagamento" className={linkClass} onClick={onClose}>
              <FileText size={20} />
              <span>Resumo Pagamento</span>
            </NavLink>  */}

            <NavLink to="/metas" className={linkClass} onClick={onClose}>
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
    </>
  );
});

export default Sidebar;
