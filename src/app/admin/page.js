"use client"
import React, { useContext, useEffect } from 'react'
import { AuthContext } from '@/app/admin/context/auth-context';

export default function Page() {
 
  const { checkauth,username, email, phone_num, ispname } = useContext(AuthContext);
  useEffect(() => {
    checkauth();
  }, );
  return (
    <div>admin home Page
      <div>
      <p>Isp name: {ispname}</p>
        <p>username: {username}</p>
        <p>email: {email}</p>
        <p>phone: {phone_num}</p>
      </div>
    </div>
  )
}
