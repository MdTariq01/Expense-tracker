import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  const getMe = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem('accessToken');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      const res = await api.get('/auth/me');
      setUser(res.data?.data?.user || res.data?.data);
      setAccessToken(storedToken);
    } catch {
      // Token invalid / expired
      localStorage.removeItem('accessToken');
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getMe();
  }, [getMe]);

  // Login
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { accessToken: token, user: userData } = res.data.data;
    localStorage.setItem('accessToken', token);
    setAccessToken(token);
    setUser(userData);
    return res.data;
  };

  // Logout
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore errors
    } finally {
      localStorage.removeItem('accessToken');
      setAccessToken(null);
      setUser(null);
    }
  };

  // Register
  const register = async (name, email, password, monthlyIncome, currency) => {
    const res = await api.post('/auth/register', { 
      name, 
      email, 
      password, 
      monthlyIncome, 
      currency 
    });
    // Auto-login after registration
    if (res.data?.data?.accessToken) {
      const { accessToken: token, user: userData } = res.data.data;
      localStorage.setItem('accessToken', token);
      setAccessToken(token);
      setUser(userData);
    } else {
      // Try logging in
      await login(email, password);
    }
    return res.data;
  };

  const value = {
    user,
    accessToken,
    loading,
    login,
    logout,
    register,
    getMe,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
