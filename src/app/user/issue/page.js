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
import { Textarea } from "@/components/ui/textarea"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

function Page() {
  const [issues, setIssues] = useState([]);
  const [tickets, settickets] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/user/login"); // Redirect to login if no token found
      return;
    }

    const fetchIssues = async () => {
      try {
        const response = await axios.get("/api/user/issue");
        setIssues(response.data);
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to load Issues!",
        });
      }
    };


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
    fetchIssues();

    
  }, []);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setCurrentDate(`${year}-${month}-${day}`);
  }, []);

  const handleSubmit = async () => {
    try {
      await axios.post("/api/user/ticket/", {
        name: selectedIssue.name,
        description,
        date,
        time
      });

      toast({
        variant: "success",
        description: "Ticket created successfully",
      });

      // Reset form fields
      setDescription('');
      setDate('');
      setTime('');
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to create ticket!",
      });
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  return (
    <main className="flex justify-center items-center flex-col p-2 px-4">
      <h2 className="text-xl text-center font-bold mb-4">What's wrong with you?</h2>

      <div className="flex flex-wrap justify-center items-center">
        {issues.map((issue) => (
          <Dialog key={issue._id} onOpenChange={() => setSelectedIssue(issue)}>
            <DialogTrigger>
              <Card className="m-5">
                <CardHeader>
                  <CardTitle className="text-xl">{issue.name}</CardTitle>
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Problem: {issue.name}</DialogTitle>
                <DialogDescription>
                  <p className="text-md mb-3">Give Description</p>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                  <p className="text-md my-3">Add Date</p>
                  <Input type="date" max={currentDate} value={date} onChange={(e) => setDate(e.target.value)} className="flex justify-center items-center" />
                  <p className="text-md my-3">Add Time</p>
                  <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="flex justify-center items-center" />
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="secondary">
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  Open ticket
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ))}
      </div>
      {tickets &&
      <>
      <Separator className="my-3" />

        <h2 className="text-xl text-center font-bold my-4">Previously Open Tickets</h2>
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
      </>
}
    </main>
  );
}

export default Page;
