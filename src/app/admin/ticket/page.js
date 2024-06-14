"use client";

import { useState, useEffect, useContext } from "react";
import axios from "axios";

import { AuthContext } from "@/app/admin/context/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Skeleton} from "@/components/ui/skeleton";


function Page() {
  const [tickets, settickets] = useState([]);
  const { toast } = useToast();

  const { checkauth, ispname } = useContext(AuthContext);
  const [ isloading, setIsloading ] = useState(false);
  useEffect(() => {
    checkauth();

    const fetchtickets = async () => {
      try {
        setIsloading(true)
        const response = await axios.get("/api/admin/ticket", {
          params: {
            isp_name: ispname,
          },
        });
        await new Promise((resolve) => setTimeout(resolve,400));
        settickets(response.data);
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to load Tickets!",
        });
      }
      finally{
        setIsloading(false)
      }
    };

    fetchtickets();
  }, []);

  return (
    <main className="">
      <h2 className="text-xl text-center font-bold my-4">Open Tickets </h2>
      {isloading ? 
      (<><div className="w-full">
      <div className="flex items-center py-4">
        <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0 max-w-sm">
          <Skeleton className="w-[128px] max-w-full" />
        </div>
        <div className="inline-flex items-center justify-center transition-colors border border-input h-10 px-4 py-2 ml-auto">
          <Skeleton className="w-[64px] max-w-full" />
         
        </div>
      </div>
      <div className="border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom">
            <thead className="[&amp;_tr]:border-b">
              <tr className="border-b transition-colors">
                
                <th className="h-12 px-4 text-left align-middle ">
                  <Skeleton className="w-[48px] max-w-full" />
                </th>
                <th className="h-12 px-4 text-left align-middle ">
                  <div className="inline-flex items-center justify-center transition-colors h-10 px-4 py-2">
                    <Skeleton className="w-[40px] max-w-full" />
                  </div>
                </th>
                <th className="h-12 px-4 text-left align-middle ">
                  <div className="text-right">
                    <Skeleton className="w-[48px] max-w-full" />
                  </div>
                </th>
                <th className="h-12 px-4 text-left align-middle ">
                  <div className="text-right">
                    <Skeleton className="w-[48px] max-w-full" />
                  </div>
                </th>
                <th className="h-12 px-4 text-left align-middle ">
                  <div className="text-right">
                    <Skeleton className="w-[48px] max-w-full" />
                  </div>
                </th>
                <th className="h-12 px-4 text-left align-middle ">
                  <div className="text-right">
                    <Skeleton className="w-[48px] max-w-full" />
                  </div>
                </th>
    
              </tr>
            </thead>
            <tbody className="[&amp;_tr:last-child]:border-0">
              <tr className="border-b transition-colors">
                
                <td className="p-4 align-middle ">
                  <div>
                    <Skeleton className="w-[56px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div>
                    <Skeleton className="w-[120px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div className="text-right">
                    <Skeleton className="w-[56px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div>
                    <Skeleton className="w-[56px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div>
                    <Skeleton className="w-[120px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div className="text-right">
                    <Skeleton className="w-[56px] max-w-full" />
                  </div>
                </td>
                
              </tr>
              <tr className="border-b transition-colors">
                
                <td className="p-4 align-middle ">
                  <div>
                    <Skeleton className="w-[56px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div>
                    <Skeleton className="w-[120px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div className="text-right">
                    <Skeleton className="w-[56px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div>
                    <Skeleton className="w-[56px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div>
                    <Skeleton className="w-[120px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div className="text-right">
                    <Skeleton className="w-[56px] max-w-full" />
                  </div>
                </td>
                
              </tr>
              <tr className="border-b transition-colors">
                
                <td className="p-4 align-middle ">
                  <div>
                    <Skeleton className="w-[56px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div>
                    <Skeleton className="w-[120px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div className="text-right">
                    <Skeleton className="w-[56px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div>
                    <Skeleton className="w-[56px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div>
                    <Skeleton className="w-[120px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div className="text-right">
                    <Skeleton className="w-[56px] max-w-full" />
                  </div>
                </td>
                
              </tr>
              <tr className="border-b transition-colors">
                
                <td className="p-4 align-middle ">
                  <div>
                    <Skeleton className="w-[56px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div>
                    <Skeleton className="w-[120px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div className="text-right">
                    <Skeleton className="w-[56px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div>
                    <Skeleton className="w-[56px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div>
                    <Skeleton className="w-[120px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div className="text-right">
                    <Skeleton className="w-[56px] max-w-full" />
                  </div>
                </td>
                
              </tr>
              <tr className="border-b transition-colors">
                
                <td className="p-4 align-middle ">
                  <div>
                    <Skeleton className="w-[56px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div>
                    <Skeleton className="w-[120px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div className="text-right">
                    <Skeleton className="w-[56px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div>
                    <Skeleton className="w-[56px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div>
                    <Skeleton className="w-[120px] max-w-full" />
                  </div>
                </td>
                <td className="p-4 align-middle ">
                  <div className="text-right">
                    <Skeleton className="w-[56px] max-w-full" />
                  </div>
                </td>
                
              </tr>
             
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        
        <div className="space-x-2">
          <div className="inline-flex items-center justify-center transition-colors border border-input h-9 px-3">
            <Skeleton className="w-[64px] max-w-full" />
          </div>
          <div className="inline-flex items-center justify-center transition-colors border border-input h-9 px-3">
            <Skeleton className="w-[32px] max-w-full" />
          </div>
        </div>
      </div>
    </div>
  </>):
    (<DataTable columns={columns} data={tickets} />)}
    </main>
  );
}

export default Page;
