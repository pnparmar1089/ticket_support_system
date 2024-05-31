"use client"

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
        header: "Problem",
      },

      {
        accessorKey: "ticketNumber",
        header: "Ticket Number",
      },
      {
        accessorKey: "createdAt",
        header:  "Time",
        cell: ({ row }) => {
          const formatted = formatDate(row.getValue("createdAt"))     
          return formatted
        },
      },
      {
        accessorKey: "status",
        header: "Status",
      },
]