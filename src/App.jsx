import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { FilterProvider } from './context/FilterContext'; // <--- IMPORTAR
import { useContext } from 'react';
import { DateRangeProvider } from './context/DateRangeContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import Caixas from './pages/Caixas';
import Incentivo from './pages/Incentivo';
import Pagamento from './pages/Pagamento';
import Metas from './pages/Metas';
<<<<<<< HEAD
import Home from './pages/Home';
import Xadrez from './pages/Xadrez';
=======
>>>>>>> 725bf39c07d041b12c30db695b890b2c33c1b67e

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
<<<<<<< HEAD
      <DateRangeProvider>
=======
      <FilterProvider> {/* <--- ENVOLVER COM FILTER PROVIDER */}
>>>>>>> 725bf39c07d041b12c30db695b890b2c33c1b67e
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
<<<<<<< HEAD
              <Route path="/home" element={<Home />} />
              <Route path="/xadrez" element={<Xadrez />} />
              <Route path="/incentivo" element={<Incentivo />} /> 
              <Route path="/caixas" element={<Caixas />} /> 
=======
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/incentivo" element={<Incentivo />} />
              <Route path="/caixas" element={<Caixas />} />
>>>>>>> 725bf39c07d041b12c30db695b890b2c33c1b67e
              <Route path="/pagamento" element={<Pagamento />} />
              <Route path="/metas" element={<Metas />} />
            </Route>
            
<<<<<<< HEAD
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </BrowserRouter>
      </DateRangeProvider>
=======
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </FilterProvider>
>>>>>>> 725bf39c07d041b12c30db695b890b2c33c1b67e
    </AuthProvider>
  );
}

export default App;
