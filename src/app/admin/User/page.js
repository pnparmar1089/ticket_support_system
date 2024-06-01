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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }).max(50, { message: "Username must be at most 50 characters." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50, { message: "Name must be at most 50 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  Phone_num: z.string().regex(/^\d{10}$/, { message: "Phone number must be 10 digits." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  cpassword: z.string().min(6, { message: "Confirm Password must be at least 6 characters." }),
}).refine(data => data.password === data.cpassword, {
  message: "Passwords do not match.",
  path: ["cpassword"],
});

function Page() {
  const [users, setUsers] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentDeleteUser, setCurrentDeleteUser] = useState(null);
  const { checkauth, ispname } = useContext(AuthContext);
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
  };

  const handleCloseUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
    setCurrentUser(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCurrentDeleteUser(null);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete("/api/admin/user", { data: { id: currentDeleteUser._id } });
      if (response.status === 200) {
        toast({
          description: "User deleted successfully.",
        });
        setUsers(prevUsers => prevUsers.filter(user => user._id !== currentDeleteUser._id));
        handleCloseDeleteDialog();
      } else {
        toast({
          variant: "destructive",
          description: "Failed to delete User!",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to delete User!",
      });
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      Phone_num: "",
      password: "",
      cpassword: "",
    },
  });

  const handleSubmit = async (value) => {
    value.ispname = ispname;
    try {
      const response = await axios.post("/api/admin/user", value);
      if (response.status === 201) {
        toast({
          description: "User added successfully.",
        });
        const newUser = response.data;
        setUsers([...users, newUser]);
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

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    checkauth();
    try {
      const response = await axios.put("/api/admin/user", { id: currentUser._id, ...currentUser });
      if (response.status === 200) {
        toast({
          description: "User updated successfully.",
        });
        setUsers(users.map(user => (user._id === currentUser._id ? response.data : user)));
        handleCloseUpdateDialog();
      } else {
        toast({
          variant: "destructive",
          description: "Failed to update user.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update user.",
      });
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleUpdateChange = (e) => {
    const { id, value } = e.target;
    setCurrentUser((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <main className="">
      <div className="flex items-center justify-end mb-4">
        <Button onClick={handleAddUser}>Add User</Button>
      </div>
      <DataTable columns={columns(setUsers, setIsUpdateDialogOpen, setCurrentUser, setIsDeleteDialogOpen, setCurrentDeleteUser)} data={users} />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Click save when you're done.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <div className="grid gap-4 py-4">
                <FormField control={form.control} name="username" render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="username" className="block mb-1">Username</FormLabel>
                    <FormControl>
                      <Input id="username" {...field} className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name" className="block mb-1">Name</FormLabel>
                    <FormControl>
                      <Input id="name" {...field} className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email" className="block mb-1">Email</FormLabel>
                    <FormControl>
                      <Input id="email" {...field} type="email" className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="Phone_num" render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="Phone_num" className="block mb-1">Phone Number</FormLabel>
                    <FormControl>
                      <Input id="Phone_num" {...field} className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password" className="block mb-1">Password</FormLabel>
                    <FormControl>
                      <Input id="password" {...field} type="password" className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="cpassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="cpassword" className="block mb-1">Confirm Password</FormLabel>
                    <FormControl>
                      <Input id="cpassword" {...field} type="password" className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="reset" variant="secondary" onClick={() => form.reset()}>Reset</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update User</DialogTitle>
            <DialogDescription>Click save when you're done.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid items-center gap-2">
                <Label htmlFor="username" className="block mb-1">
                  Username
                </Label>
                <Input
                  type="text"
                  id="username"
                  value={currentUser?.username || ''}
                  onChange={handleUpdateChange}
                  required
                  className="border p-2 w-full rounded"
                />
                <Label htmlFor="name" className="block mb-1">
                  Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  value={currentUser?.name || ''}
                  onChange={handleUpdateChange}
                  required
                  className="border p-2 w-full rounded"
                />
                <Label htmlFor="email" className="block mb-1">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={currentUser?.email || ''}
                  onChange={handleUpdateChange}
                  required
                  className="border p-2 w-full rounded"
                />
                <Label htmlFor="Phone_num" className="block mb-1">
                  Phone Number
                </Label>
                <Input
                  type="text"
                  id="Phone_num"
                  value={currentUser?.Phone_num || ''}
                  onChange={handleUpdateChange}
                  required
                  className="border p-2 w-full rounded"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={handleCloseUpdateDialog}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this User? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <DialogClose className="flex gap-3">
              <Button type="button" variant="secondary" onClick={handleCloseDeleteDialog}>
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default Page;
