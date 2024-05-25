"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

function Page() {
  const [name, setName] = useState("");
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login"); // Redirect to login if no token found
      return;
    }

    const fetchIssues = async () => {
      try {
        const response = await axios.get("/api/admin/issue");
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

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login"); // Redirect to login if no token found
      return;
    }
    try {
      const response = await axios.post("/api/admin/issue", { name });

      if (response.status === 201) {
        toast({
          description: "Issue saved successfully.",
        });
        setName("");
        setIssues([...issues, response.data]);
        setIsAddDialogOpen(false);
      } else {
        toast({
          variant: "destructive",
          description: "Failed to save Issue!",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to save Issue!",
      });
    }
  };

  const handleShowToggle = async (issue) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login"); // Redirect to login if no token found
      return;
    }
    try {
      const response = await axios.put("/api/admin/issue", { id: issue._id, show: !issue.show });

      if (response.status === 200) {
        toast({
          description: "Issue show status updated successfully.",
        });
        setIssues(
          issues.map((i) =>
            i._id === issue._id ? { ...i, show: response.data.show } : i
          )
        );
      } else {
        toast({
          variant: "destructive",
          description: "Failed to update show status!",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update show status!",
      });
    }
  };

  const handleUpdate = (issue) => {
    setSelectedIssue(issue);
    setName(issue.name);
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login"); // Redirect to login if no token found
      return;
    }
    e.preventDefault();

    try {
      const response = await axios.put("/api/admin/issue", { id: selectedIssue._id, name });

      if (response.status === 200) {
        toast({
          description: "Issue updated successfully.",
        });
        setIssues(
          issues.map((issue) =>
            issue._id === selectedIssue._id ? response.data : issue
          )
        );
        setSelectedIssue(null);
        setName("");
        setIsUpdateDialogOpen(false);
      } else {
        toast({
          variant: "destructive",
          description: "Failed to update Issue!",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update Issue!",
      });
    }
  };

  const handleDelete = (issue) => {
    setIssueToDelete(issue);
    setIsConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login"); // Redirect to login if no token found
      return;
    }
    try {
      const response = await axios.delete("/api/admin/issue", { data: { id: issueToDelete._id } });

      if (response.status === 200) {
        toast({
          description: "Issue deleted successfully.",
        });
        setIssues(issues.filter((issue) => issue._id !== issueToDelete._id));
        setIsConfirmDialogOpen(false);
        setIssueToDelete(null);
      } else {
        toast({
          variant: "destructive",
          description: "Failed to delete Issue!",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to delete Issue!",
      });
    }
  };

  const handleAddDialogOpen = () => {
    setName("");
    setSelectedIssue(null);
    setIsAddDialogOpen(true);
  };

  const handleUpdateDialogClose = () => {
    setIsUpdateDialogOpen(false);
    setSelectedIssue(null);
    setName("");
  };

  return (
    <main className="p-2 px-4">
      <div className="flex items-center justify-end mb-4">
        <Button onClick={handleAddDialogOpen}>Add</Button>
      </div>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Issue</DialogTitle>
            <DialogDescription>
              Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit">Save</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Issue</DialogTitle>
            <DialogDescription>
              Update the issue details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit">Save Changes</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this Issue? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <h2 className="text-xl text-center font-bold mb-4">Issues</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Issue</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Show</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue, index) => (
            <TableRow key={issue._id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{issue.name}</TableCell>
              <TableCell className="flex gap-5 justify-center items-center">
                <Button variant="secondary" onClick={() => handleUpdate(issue)}>
                  Update
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(issue)}>
                  Delete
                </Button>
              </TableCell>
              <TableCell>
                <Switch checked={issue.show} onCheckedChange={() => handleShowToggle(issue)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}

export default Page;
