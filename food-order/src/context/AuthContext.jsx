import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.getItem('token')) {
        try {
          const userData = await fetchWithAuth('/auth/me');
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const data = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const signup = async (name, email, password) => {
    const data = await fetchWithAuth('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
