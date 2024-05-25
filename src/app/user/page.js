"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

export default function page() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/user/login"); // Redirect to login if no token found
      return;
    }}, []);
  return (
    <div>Home Page</div>
  )
}
