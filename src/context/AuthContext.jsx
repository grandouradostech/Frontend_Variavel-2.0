import { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { jwtDecode } from "jwt-decode"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Verifica se o token expirou
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser({ username: decoded.sub, role: decoded.role });
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        setError("Token inválido ou expirado. Faça login novamente.");
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // IMPORTANTE: FastAPI OAuth2 exige Form Data, não JSON
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await api.post('/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token, role } = response.data;

      localStorage.setItem('access_token', access_token);
      
      // Decodificar para atualizar o estado imediatamente
      const decoded = jwtDecode(access_token);
      setUser({ username: decoded.sub, role: role });
      setError(null); // Clear any previous errors

      return { success: true };
    } catch (error) {
      console.error("Erro no login:", error);
      const errorMessage = error.response?.data?.detail || 'Erro ao fazer login';
      setError(errorMessage);
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setError(null); // Clear error on logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};