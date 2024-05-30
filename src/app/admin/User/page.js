"use client";

import { useState, useEffect, useContext } from "react";
import axios from "axios";

import { AuthContext } from "@/app/admin/context/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function Page() {
  const [users, setUsers] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { checkauth, ispname } = useContext(AuthContext);

  const [userData, setUserData] = useState({
    username: "",
    password: "",
    cpassword: "",
    name: "",
    email: "",
    Phone_num: "",
    ispname: ispname,
  });

  const { toast } = useToast();

  useEffect(() => {
    checkauth();

    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/admin/user", {
          params: {
            isp_name: ispname,
          },
        });
        setUsers(response.data);
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to load Users!",
        });
      }
    };

    fetchUsers();
  }, [checkauth, ispname, toast]);

  const handleAddUser = () => {
    setIsAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    // Reset user data
    setUserData({
      username: "",
      password: "",
      cpassword: "",
      name: "",
      email: "",
      Phone_num: "",
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/admin/user", userData);
      if (response.status === 201) {
        toast({
          description: "User added successfully.",
        });
        // Refresh user list
        const newUser = response.data;
        setUsers([...users, newUser]);
        // Close dialog and reset form
        handleCloseDialog();
      } else {
        toast({
          variant: "destructive",
          description: "Failed to add user.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to add user.",
      });
    }
  };

  return (
    <main className="">
      <div className="flex items-center justify-end mb-4">
        <Button onClick={handleAddUser}>Add User</Button>
      </div>
      <DataTable columns={columns} data={users} />

      {/* Add User Dialog */}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Click save when you're done.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid  items-center gap-2">
                
                  <Label htmlFor="username" className="block mb-1">
                    Username
                  </Label>
                  <Input
                    type="text"
                    id="username"
                    value={userData.username}
                    onChange={handleChange}
                    required
                    className="border p-2 w-full rounded"
                  />

                  

                  <Label htmlFor="name" className="block mb-1">
                    Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    value={userData.name}
                    onChange={handleChange}
                    required
                    className="border p-2 w-full rounded"
                  />

                  <Label htmlFor="email" className="block mb-1">
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    value={userData.email}
                    onChange={handleChange}
                    required
                    className="border p-2 w-full rounded"
                  />

                  <Label htmlFor="Phone_num" className="block mb-1">
                    Phone Number
                  </Label>
                  <Input
                    type="text"
                    id="Phone_num"
                    value={userData.Phone_num}
                    onChange={handleChange}
                    required
                    className="border p-2 w-full rounded"
                  />

<Label htmlFor="password" className="block mb-1">
                    Password
                  </Label>
                  <Input
                    type="password"
                    id="password"
                    value={userData.password}
                    onChange={handleChange}
                    required
                    className="border p-2 w-full rounded"
                  />

            <Label htmlFor="cpassword" className="block mb-1">
                    Conform Password
                  </Label>
                  <Input
                    type="password"
                    id="cpassword"
                    value={userData.cpassword}
                    onChange={handleChange}
                    required
                    className="border p-2 w-full rounded"
                  />
                
              </div>
            </div>
            <DialogFooter>
              <Button type="reset" variant="secondary">Reset</Button>

             
                <Button type="submit">Save</Button>
    
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default Page;
