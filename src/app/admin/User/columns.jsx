"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

const handleUpdate = (data, setUpdateDialogOpen, setCurrentUser) => {
  setCurrentUser(data);
  setUpdateDialogOpen(true);
};

export const columns = (setUsers, setUpdateDialogOpen, setCurrentUser, setDeleteDialogOpen, setCurrentDeleteUser) => [
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
      return (
        <div className="flex gap-2 justify-center items-center">
          <Button variant="secondary" onClick={() => handleUpdate(row.original, setUpdateDialogOpen, setCurrentUser)}>
            Update
          </Button>
          <Button variant="destructive" onClick={() => {
            setCurrentDeleteUser(row.original);
            setDeleteDialogOpen(true);
          }}>
            Delete
          </Button>
        </div>
      );
    },
  },
];
