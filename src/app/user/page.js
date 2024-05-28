"use client"
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '@/app/user/context/auth-context';

export default function page() {
 
  const { checkauth,username, email, phone_num,ispname } = useContext(AuthContext);
  useEffect(() => {
    checkauth();
  }, []);
  return (
    <div>Home Page
      <div>
      <p>ispname: {ispname}</p>
        <p>username: {username}</p>
        <p>email: {email}</p>
        <p>phone: {phone_num}</p>
      </div>
    </div>
    
  )
}
