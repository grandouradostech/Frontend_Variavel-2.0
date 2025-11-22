import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = memo(() => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar Fixa */}
      <Sidebar />

      {/* Área de Conteúdo Principal */}
      <div className="ml-64 flex-1 p-8">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm min-h-[calc(100vh-4rem)] p-6">
          {/* Aqui é onde as páginas filhas serão renderizadas */}
          <Outlet />
        </div>
      </div>
    </div>
  );
});

export default Layout;