"use client";

import { useState, useEffect, useContext } from "react";
import axios from "axios";

import { AuthContext } from "@/app/admin/context/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

function Page() {
  const [tickets, settickets] = useState([]);
  const { toast } = useToast();

  const { checkauth, ispname } = useContext(AuthContext);

  useEffect(() => {
    checkauth();

    const fetchtickets = async () => {
      try {
        const response = await axios.get("/api/admin/ticket", {
          params: {
            isp_name: ispname,
          },
        });

        settickets(response.data);
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to load Tickets!",
        });
      }
    };

    fetchtickets();
  }, );

  return (
    <main className="">
      <h2 className="text-xl text-center font-bold my-4">Open Tickets </h2>

      <DataTable columns={columns} data={tickets} />
    </main>
  );
}

export default Page;
