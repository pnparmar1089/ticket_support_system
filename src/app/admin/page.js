"use client"
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '@/app/admin/context/auth-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
export default function Page() {
  const [user,setUser] = useState('');
  const [ticket,setTicket] = useState('');
  const [issue,setIssue] = useState('');
 
  const { checkauth,ispname } = useContext(AuthContext);
  useEffect(() => {
    checkauth();
    const fetchdata = async () => {
      try {
        const response = await axios.get("/api/admin/home", {
          params: {
            isp_name: ispname,
          },
        });
        setUser(response.data.users);
        setTicket(response.data.tickets);
        setIssue(response.data.issues);
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to load data!",
        });
      }
    };
    fetchdata();
  }, );
  

  return (
    <div>
      
      <div className='flex flex-wrap justify-center items-center gap-10'>
      <Card>
      <CardHeader className="">
        <CardTitle className="text-xl">Users</CardTitle>
        <CardTitle className="text-4xl">{user}</CardTitle>
      </CardHeader>      
    </Card>
    <Card>
      <CardHeader className="">
        <CardTitle className="text-xl">Tickets</CardTitle>
        <CardTitle className="text-4xl">{ticket}</CardTitle>
      </CardHeader>      
    </Card>
    <Card>
      <CardHeader className="">
        <CardTitle className="text-xl">Issues</CardTitle>
        <CardTitle className="text-4xl">{issue}</CardTitle>
      </CardHeader>      
    </Card>
    </div>

    

    </div>
  )
}
