"use client"
import React, { useEffect } from 'react'

export default function page() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login"); // Redirect to login if no token found
      return;
    }}, []);
  return (
    <div>Home Page</div>
  )
}
