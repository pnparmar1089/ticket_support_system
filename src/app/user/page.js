"use client"
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/app/user/context/auth-context';
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
export default function Page() {
  const [ticket,setTicket] = useState('');
  const [openticket,setOpenTicket] = useState('');
  const [closeticket,setCloseTicket] = useState('');
  const [solvedticket,setSolvedTicket] = useState('');
  const [workingticket,setWorkingTicket] = useState('');

 
  const { checkauth,username } = useContext(AuthContext);
  useEffect(() => {
    checkauth();
    const fetchdata = async () => {
      try {
        const response = await axios.get("/api/user/home", {
          params: {
            user_name: username,
          },
        });
        
        setTicket(response.data.tickets);
        setOpenTicket(response.data.opentickets);
        setCloseTicket(response.data.closetickets);
        setSolvedTicket(response.data.solvedtickets);
        setWorkingTicket(response.data.workingtickets);
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
