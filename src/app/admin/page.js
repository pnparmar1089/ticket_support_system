"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState(null); // State to manage the issue to be deleted
  const { toast } = useToast();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get("/api/issue");
        setIssues(response.data);
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to load issues!",
        });
      }
    };

    fetchIssues();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/issue", { name });

      if (response.status === 201) {
        toast({
          description: "Issue saved successfully.",
        });
        setName("");
        setIssues([...issues, response.data]);
        setIsDialogOpen(false);
      } else {
        toast({
          variant: "destructive",
          description: "Failed to save issue!",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to save issue!",
      });
    }
  };

  const handleUpdate = (issue) => {
    setSelectedIssue(issue);
    setName(issue.name);
    setIsDialogOpen(true);
  };

  const handleSaveUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put("/api/issue", { id: selectedIssue._id, name });

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
        setIsDialogOpen(false);
      } else {
        toast({
          variant: "destructive",
          description: "Failed to update issue!",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update issue!",
      });
    }
  };

  const handleDelete = (issue) => {
    setIssueToDelete(issue);
    setIsConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete("/api/issue", { data: { id: issueToDelete._id } });

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
          description: "Failed to delete issue!",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to delete issue!",
      });
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedIssue(null);
    setName("");
  };

  return (
    <main className="container mx-auto p-6">
      <div className="flex items-center justify-end mb-4">
        <Button onClick={() => setIsDialogOpen(true)}>Add</Button>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedIssue ? "Update Issue" : "Add New Issue"}</DialogTitle>
            <DialogDescription>
              {selectedIssue ? "Update the issue details." : "Click save when you're done."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={selectedIssue ? handleSaveUpdate : handleSubmit}>
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
                <Button type="submit">{selectedIssue ? "Save Changes" : "Save"}</Button>
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
              Are you sure you want to delete this issue? This action cannot be undone.
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
                <Button  variant="secondary" onClick={() => handleUpdate(issue)}>
                  Update
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(issue)}>
                  Delete
                </Button>
              </TableCell>
              <TableCell>
                <Switch />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}

export default Page;
