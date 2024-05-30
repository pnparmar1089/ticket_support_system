"use client"

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };
  
export const columns = [
    {
        accessorKey: "username",
        header: "User Name",
      },
      {
        accessorKey: "name",
        header: "Name",
      },

      {
        accessorKey: "email",
        header: "E-Mail",
      },     
      {
        accessorKey: "Phone_num",
        header: "Phone Number",
      },
      {
        accessorKey: "_id",
        header: "Action",
        cell: ({ row }) => {
          const data = row.original
     
          return (<div className="flex gap-2 justify-center items-center">
          <Button variant="secondary" onClick={() => handleUpdate(data)}>
            Update
          </Button>
          <Button variant="destructive" onClick={() => handleDelete(data)}>
            Delete
          </Button></div>)
        },
      },
      
]
