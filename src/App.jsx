import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import { DateRangeProvider } from './context/DateRangeContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import Caixas from './pages/Caixas';
import Incentivo from './pages/Incentivo';
import Pagamento from './pages/Pagamento';
import Metas from './pages/Metas';
import Home from './pages/Home';
import Xadrez from './pages/Xadrez';

// Componente para proteger rotas
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <DateRangeProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route path="/home" element={<Home />} />
              <Route path="/xadrez" element={<Xadrez />} />
              <Route path="/incentivo" element={<Incentivo />} /> 
              <Route path="/caixas" element={<Caixas />} /> 
              <Route path="/pagamento" element={<Pagamento />} />
              <Route path="/metas" element={<Metas />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </BrowserRouter>
      </DateRangeProvider>
    </AuthProvider>
  );
}

export default App;
