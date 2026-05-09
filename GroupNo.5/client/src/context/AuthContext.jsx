import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('sp_token');
      const savedUser  = localStorage.getItem('sp_user');
      if (savedToken && savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      }
    } catch (e) {
      localStorage.removeItem('sp_token');
      localStorage.removeItem('sp_user');
    } finally {
      setReady(true);
    }
  }, []);

  const login = (data) => {
    setToken(data.token);
    setUser(data.user);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    localStorage.setItem('sp_token', data.token);
    localStorage.setItem('sp_user',  JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('sp_token');
    localStorage.removeItem('sp_user');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('sp_user', JSON.stringify(updatedUser));
  };

  // Always render children — never block on ready
  return (
    <AuthContext.Provider value={{ user, token, ready, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);