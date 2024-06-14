
"use client";

import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/app/admin/context/auth-context';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." })
});

export default function LoginPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!!token) {
      router.push("/admin/"); // Redirect to user dashboard if token is found
      return;
    }
  }, );

  // Define the form using react-hook-form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    },
  });

  const handleSubmit = async (values) => {
  
    try {
      setLoading(true);
      const response = await axios.post('/api/admin/login', values);
      const { token } = response.data;
      login(token);  // Set authentication state
    } catch (error) {
      if (error.response) {
        form.setError("root.serverError",{message: error.response.data.error});
      } else {
        form.setError("root.serverError", { message:'Network error. Please try again later.'});
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Log In</CardTitle>
          <CardDescription>Log in Admin Only</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Your Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter Your Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.formState.errors.root?.serverError && (
                <p className="text-red-500">{form.formState.errors.root.serverError.message}</p>
              )}
              <div className='flex justify-center items-center'>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Logging In...' : 'Log In'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col justify-between">
          <Button variant="link">Forgot Password</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
