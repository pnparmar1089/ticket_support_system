// pages/user/login.js
"use client";

import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/app/user/context/auth-context';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!!token) {
      router.push("/user/"); // Redirect to login if no token found
      return;
    }}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/user/login', { username, password });
      const { token } = response.data;
      login(token);  // Set authentication state
     
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else {
        setError('Network error. Please try again later.');
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Log In</CardTitle>
          <CardDescription>Log in user Only</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="Enter Your Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter Your Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              {error && <p className="text-red-500">{error}</p>} {/* Render error message */}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col justify-between">
          <Button type="submit" onClick={handleSubmit}>Log In</Button>
          <Button variant="link">Forgot Password</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
