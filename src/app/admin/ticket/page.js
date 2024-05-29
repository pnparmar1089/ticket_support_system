"use client";

import { useState, useEffect, useContext } from "react";
import axios from "axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AuthContext } from '@/app/admin/context/auth-context';
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area"



function Page() {
  
  const [tickets, settickets] = useState([]); 
  const { toast } = useToast();

  const { checkauth, ispname } = useContext(AuthContext);

  useEffect(() => {
    checkauth();



    const fetchtickets = async () => {
      try {
        const response = await axios.get("/api/admin/ticket",{
          params: {
            isp_name: ispname
          }});
     
        settickets(response.data);
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to load Tickets!",
        });
      }
    };

    fetchtickets();


    
  }, []);

  


  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  return (
    <main className="flex justify-center items-center flex-col p-2 px-4">
    
   

        <h2 className="text-xl text-center font-bold my-4">Open Tickets </h2>
      <div className="flex flex-wrap justify-center items-center">

        {tickets.map((ticket) => ( 
            <Card className="m-5">
            
          <CardHeader>
            <CardDescription>number</CardDescription>
            <CardDescription>{formatDate(ticket.createdAt)}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{ticket.name}</p>
            

            <ScrollArea className="h-[150px] w-[300px] p-4">
                {ticket.description}
</ScrollArea>
            
          </CardContent>
          <CardFooter>
          <p>Date: {ticket.date} , Time: {ticket.time}</p>
            
          </CardFooter>
        </Card>
        
        ))}
      </div>
     

    </main>
  );
}

export default Page;
