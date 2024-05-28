// context/auth-context.js
"use client"
import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const[ispname,setIspname] = useState('');
  const [username, setUsername] = useState('');
  const [phone_num, setPhone_num] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    router.push('/user');
  };


  const checkauth = async () => {
    const token = localStorage.getItem('token');
  
    if (token) {
      try {
        const response = await axios.post('/api/user/checkauth', { token }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.status === 200) {
         
          // Token is valid, return user details
          setIspname(response.data.isp_name);
          setEmail(response.data.email);
          setUsername(response.data.username);
          setPhone_num(response.data.Phone_num);
          return
        } else {
          // Token is invalid, remove it from local storage
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          router.push("/user/login");
          return
        }
      } catch (error) {
        // console.error('Error during authentication check:', error);
        // If an error occurs (e.g., token is invalid), remove it from local storage
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        router.push("/user/login");
        return
      }
    } else {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
        router.push("/user/login");
        return
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
  
    if (token) {
      try {
        // Call the logout API endpoint to remove the token from the database
        await axios.post('/api/user/logout', { token }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        
        // Remove the token from local storage
        localStorage.removeItem('token');

         // Redirect to the login page
         setIsAuthenticated(false);
         router.push('/user/login');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
  
   
  };
  

  return (
    <AuthContext.Provider value={{ login, logout,checkauth, isAuthenticated, username, email, phone_num, ispname }}>
      {children}
    </AuthContext.Provider>
  );
};
