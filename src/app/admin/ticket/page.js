"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

function Page() {
  
  const [tickets, settickets] = useState([]); 
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/user/login"); // Redirect to login if no token found
      return;
    }

    


    const fetchtickets = async () => {
      try {
        const response = await axios.get("/api/user/ticket");
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
    
   

        <h2 className="text-xl text-center font-bold my-4">Open Tickets</h2>
      <div className="flex flex-wrap justify-center items-center">

        {tickets.map((ticket) => ( 
            <Card className="m-5">
            
          <CardHeader>
            <CardDescription>number</CardDescription>
            <CardDescription>{formatDate(ticket.createdAt)}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{ticket.name}</p>
            <p>{ticket.description}</p>
            
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
