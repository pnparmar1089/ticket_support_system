"use client"
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ispname, setIspname] = useState('');
  const [username, setUsername] = useState('');
  const [phone_num, setPhone_num] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const checkauth = useCallback(async () => {
    const token = localStorage.getItem('token');
  
    if (token) {
      try {
        const response = await axios.post('/api/admin/checkauth', { token }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 200) {
          setEmail(response.data.email);
          setUsername(response.data.username);
          setIspname(response.data.isp_name);
          setPhone_num(response.data.Phone_num);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          router.push("/admin/login");
        }
      } catch (error) {
        console.error('Error during authentication check:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        router.push("/admin/login");
      }
    } else {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    checkauth();
  }, [checkauth]);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    router.push('/admin');
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
  
    if (token) {
      try {
        await axios.post('/api/admin/logout', { token }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        router.push('/admin/login');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout, checkauth, isAuthenticated, username, email, phone_num, ispname }}>
      {children}
    </AuthContext.Provider>
  );
};
