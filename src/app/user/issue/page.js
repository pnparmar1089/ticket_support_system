"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";


function Page() {
  const [issues, setIssues] = useState([]);
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

    fetchIssues();
  }, []);

  

  return (
    <main className="p-2 px-4">
     
      


      

      <h2 className="text-xl text-center font-bold mb-4">Issues</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Issue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue, index) => (
            <TableRow key={issue._id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{issue.name}</TableCell>
             
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}

export default Page;
