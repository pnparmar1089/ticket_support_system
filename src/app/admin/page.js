"use client"
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '@/app/admin/context/auth-context';
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
export default function Page() {
  const [user,setUser] = useState('');
  const [ticket,setTicket] = useState('');
  const [openticket,setOpenTicket] = useState('');
  const [closeticket,setCloseTicket] = useState('');
  const [solvedticket,setSolvedTicket] = useState('');
  const [workingticket,setWorkingTicket] = useState('');
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
        setOpenTicket(response.data.opentickets);
        setCloseTicket(response.data.closetickets);
        setSolvedTicket(response.data.solvedtickets);
        setWorkingTicket(response.data.workingtickets);

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
        <CardTitle className="text-xl">Issues</CardTitle>
        <CardTitle className="text-4xl">{issue}</CardTitle>
      </CardHeader>      
    </Card>
    </div>
    <div className='flex flex-wrap justify-center items-center gap-10 mt-12'>
    <Card>
      <CardHeader className="">
        <CardTitle className="text-xl">Total Tickets</CardTitle>
        <CardTitle className="text-4xl">{ticket}</CardTitle>
      </CardHeader>      
    </Card>
    <Card>
      <CardHeader className="">
        <CardTitle className="text-xl">OPEN Tickets</CardTitle>
        <CardTitle className="text-4xl text-blue-800">{openticket}</CardTitle>
      </CardHeader>      
    </Card>
    <Card>
      <CardHeader className="">
        <CardTitle className="text-xl">Working Tickets</CardTitle>
        <CardTitle className="text-4xl text-yellow-600">{workingticket}</CardTitle>
      </CardHeader>      
    </Card>
    <Card>
      <CardHeader className="">
        <CardTitle className="text-xl">Solved Tickets</CardTitle>
        <CardTitle className="text-4xl text-green-600">{solvedticket}</CardTitle>
      </CardHeader>      
    </Card>
    <Card>
      <CardHeader className="">
        <CardTitle className="text-xl">Close Tickets</CardTitle>
        <CardTitle className="text-4xl">{closeticket}</CardTitle>
      </CardHeader>      
    </Card>
    </div>

    

    </div>
  )
}
