import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Truck, Lock, User } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false); // Alternar entre CPF e Admin

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Se for colaborador, a senha é o próprio CPF (logica simplificada)
    const passToSend = isAdmin ? password : username;
    
    const result = await login(username, passToSend);
    
    if (result.success) {
      navigate('/home'); // Redireciona após sucesso
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6 text-blue-600">
          <Truck size={48} />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Sistema de Gestão</h2>
        <p className="text-center text-gray-500 mb-8">Entre para consultar a sua variável</p>

        <div className="flex justify-center mb-6 bg-gray-100 p-1 rounded-lg">
            <button 
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${!isAdmin ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                onClick={() => { setIsAdmin(false); setUsername(''); setPassword(''); setError(''); }}
            >
                Sou Colaborador
            </button>
            <button 
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${isAdmin ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                onClick={() => { setIsAdmin(true); setUsername(''); setPassword(''); setError(''); }}
            >
                Sou Gestor
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
                {isAdmin ? "Utilizador" : "CPF (apenas números)"}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder={isAdmin ? "admin" : "000.000.000-00"}
                required
              />
            </div>
          </div>

          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          )}

          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
