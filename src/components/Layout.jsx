import React, { memo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const Layout = memo(() => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <div className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="md:hidden flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-700"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
          <div className="text-sm font-semibold text-gray-700">Variável Distribuição</div>
          <div className="w-10" />
        </div>

        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-4rem)] p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
});

export default Layout;
