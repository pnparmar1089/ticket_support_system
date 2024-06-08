"use client";

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "@/app/admin/context/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

function Page({ params }) {
  const { id } = params;
  const { checkauth, ispname } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState([]);
  const [status, setStatus] = useState("open");
  const [comment, setComment] = useState("");
  
  const { toast } = useToast();

  const fetchTickets = async () => {
    try {
      const response = await axios.get("/api/admin/ticket", {
        params: {
          isp_name: ispname,
          id: id
        },
      });
      setTickets(response.data.tickets[0]);
      setUser(response.data.user[0]);
      setStatus(response.data.tickets[0].status); // Set initial status
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to load Ticket!",
      });
    }
  };

  useEffect(() => {
    checkauth();
    fetchTickets();
  }, [checkauth, ispname, toast, id]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async () => {
    try {
      await axios.put("/api/admin/ticket", {
        id: id,
        status: status,
        comment: comment,
      });
      setComment("")
      toast({
        variant: "success",
        description: "Ticket updated successfully!",
      });
      
      fetchTickets(); // Refresh the data after successful submission
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update ticket!",
      });
    }
  };
  
  return (
    <main className="p-6 min-h-screen">
      <div className="max-w-2xl mx-auto shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold mb-2">Username: <span className="font-normal">{tickets.username}</span></p>
          <p className="text-lg font-semibold mb-2">Name: <span className="font-normal">{user.name}</span></p>
        </div>
        <p className="text-lg font-semibold mb-2">Ticket Number: <span className="font-normal">{tickets.ticketNumber}</span></p>
        <p className="text-lg font-semibold mb-2">Issue: <span className="font-normal">{tickets.name}</span></p>
        <p className="text-lg font-semibold mb-2">Description: <span className="font-normal">{tickets.description}</span></p>
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold mb-2">Date: <span className="font-normal">{tickets.date}</span></p>
          <p className="text-lg font-semibold mb-2">Time: <span className="font-normal">{tickets.time}</span></p>
        </div>
        <p className="text-lg font-semibold mb-2">Created On: <span className="font-normal">{formatDate(tickets.createdAt)}</span></p>
        <p className="text-lg font-semibold mb-2">Status: <span className="font-normal">{tickets.status}</span></p>
       {tickets.comment &&   <p className="text-lg font-semibold mb-2">Comment: <span className="font-normal">{tickets.comment}</span></p>     }   
        <p className="text-xl font-bold text-center mb-2 mt-6">Contact User</p>
        <p className="text-lg font-semibold mb-2">Phone Number: <Link href={`tel:${user.Phone_num}`} className="font-normal">{user.Phone_num}</Link></p>
        <p className="text-lg font-semibold mb-2">E-Mail: <Link href={`mailto:${user.email}?subject=TMS Ticket Number : ${tickets.ticketNumber}&body=Hello ${user.name}, Your Issue is ${tickets.name}. And Ticket Number : ${tickets.ticketNumber} `} className="font-normal">{user.email}</Link></p>
      
        <div className="mt-4">
          <Label htmlFor="status" className="text-lg font-semibold">Status:</Label>
          <Select value={status} onValueChange={(value) => setStatus(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                
                <SelectItem value="working">Working</SelectItem>
                <SelectItem value="solved">Solved</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mt-4">
          <Label htmlFor="comment" className="text-lg font-semibold">Comment:</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="block w-full mt-1 p-2 border rounded"
          />
        </div>
        
        <Button onClick={handleSubmit} className="mt-4" disabled={!comment} >Submit</Button>
      </div>
    </main>
  );
}

export default Page;
