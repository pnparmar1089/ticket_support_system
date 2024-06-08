"use client";

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "@/app/admin/context/auth-context";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

function Page({ params }) {
  const { username } = params;
  const { checkauth, ispname } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    checkauth();
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/admin/user", {
          params: {
            isp_name: ispname,
            username: username,
          },
        });
        setUsers(response.data.users[0]);
        setTickets(response.data.tickets);
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to load Users!",
        });
      }
    };
    fetchUsers();
  }, [username,checkauth, ispname, toast]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };
  return (
    <main className="">
      <div className="">
        <div className="flex gap-2 justify-between items-center px-16">
          <p>Username: {users.username}</p>
          <p>Name: {users.name}</p>
        </div>
        <Separator className="my-2" />
        <div className="flex gap-2 justify-between items-center px-16">
          <p>Phone Number: <Link href={`tel:${users.Phone_num}`}  className="font-normal">{users.Phone_num}</Link></p>
          <p>Email: <Link href={`mailto:${users.email}?subject=TMS&body=Hello ${users.name},  `} className="font-normal">{users.email}</Link></p>
        </div>
      </div>
     
      {tickets.length > 0 ? (
        <div className=" ">
          <Separator className="my-3 h-[2px]" />
          <h2 className="text-xl text-center font-bold my-4 ">Tickets</h2>
          <div className="flex flex-wrap justify-center items-center">
            {tickets.map((ticket) => (
              <Link href={`/admin/ticket/${ticket._id}`} key={ticket._id}>
              <Card key={ticket._id} className="m-5">
                <CardHeader>
                  <CardDescription>
                    Ticket Number :
                    <span className="font-bold italic">
                      {" "}
                      {ticket.ticketNumber}
                    </span>
                  </CardDescription>
                  <CardDescription>
                    {formatDate(ticket.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{ticket.name}</p>
                  <ScrollArea className="h-[150px] w-[300px] p-4">
                    {ticket.description}
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <CardDescription>
                    Date: {ticket.date} , Time: {ticket.time}
                  </CardDescription>
                  
                 
                  
                </CardFooter>
                <CardFooter className="flex justify-between">
                  <span className="font-medium italic">
                    status : {ticket.status}
                  </span>
                  
                </CardFooter>
                <CardFooter className="flex justify-between">
                  <span className="-mt-5">
                  Comment : {ticket.comment}
                  </span>
                  
                </CardFooter>
              </Card>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <Separator className="my-3 h-[2px]" />
          <h2 className="text-xl text-center font-bold my-4">
            Not Open Any Ticket !
          </h2>
        </div>
      )}
    </main>
  );
}

export default Page;
