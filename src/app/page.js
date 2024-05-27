"use client"
import Link from 'next/link'
import React, { useEffect } from 'react'

export default function page() {
 
  return (
    <div>Home Page
    <Link href="/user/">user</Link>
    <br></br>
    <Link href="/admin/">admin</Link>
    </div>
  )
}
