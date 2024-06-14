"use client";

import { useState, useEffect, useContext } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from "@/app/admin/context/auth-context";

function Page() {
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const [name, setName] = useState("");
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState(null);
  const [isloading, setIsloading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { checkauth, ispname } = useContext(AuthContext);

  useEffect(() => {
    checkauth();

    const fetchIssues = async () => {
      try {
        setIsloading(true);
        const response = await axios.get("/api/admin/issue", {
          params: {
            isp_name: ispname,
          },
        });
        await new Promise((resolve) => setTimeout(resolve, 350));
        setIssues(response.data);
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to load Issues!",
        });
      } finally {
        setIsloading(false);
      }
    };

    fetchIssues();
  }, [checkauth, ispname, toast]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    checkauth();

    setIsAddLoading(true); // Set loading to true

    try {
      const response = await axios.post("/api/admin/issue", { name, ispname });
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
    } finally {
      setIsAddLoading(false); // Set loading to false
    }
  };

  const handleShowToggle = async (issue) => {
    checkauth();

    try {
      const response = await axios.put("/api/admin/issue", {
        id: issue._id,
        show: !issue.show,
      });
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
    e.preventDefault();
    checkauth();

    setIsUpdateLoading(true); // Set loading to true

    try {
      const response = await axios.put("/api/admin/issue", {
        id: selectedIssue._id,
        name,
      });
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
    } finally {
      setIsUpdateLoading(false); // Set loading to false
    }
  };

  const handleDelete = (issue) => {
    setIssueToDelete(issue);
    setIsConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    checkauth();

    try {
      const response = await axios.delete("/api/admin/issue", {
        data: { id: issueToDelete._id },
      });
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
    <main>
      <div className="flex items-center justify-end mb-4">
        <Button onClick={handleAddDialogOpen}>Add</Button>
      </div>

      {/* Add Issue Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Issue</DialogTitle>
            <DialogDescription>
              Click save when you&apos;re done.
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
                <Button type="submit" disabled={isAddLoading}>
                  {isAddLoading ? "Saving..." : "Save"}
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Update Issue Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Issue</DialogTitle>
            <DialogDescription>Update the issue details.</DialogDescription>
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
                <Button type="submit" disabled={isUpdateLoading}>
                  {isUpdateLoading ? "Saving..." : "Save Changes"}
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this Issue? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Issues Table */}
      <h2 className="text-xl text-center font-bold mb-4">Issues</h2>

      {isloading ? (
        <>
          <div className="relative w-full overflow-auto">
            <table className="w-full">
              <thead className="[&amp;_tr]:border-b">
                <tr className="border-b transition-colors">
                  <th className="h-12 px-4 text-left align-middle">
                    <Skeleton className="w-[48px] max-w-full" />
                  </th>
                  <th className="h-12 px-4 text-left align-middle">
                    <Skeleton className="w-[56px] max-w-full" />
                  </th>
                  <th className="h-12 px-4 text-left align-middle">
                    <Skeleton className="w-[56px] max-w-full" />
                  </th>
                  <th className="h-12 px-4 align-middle text-right">
                    <Skeleton className="w-[48px] max-w-full" />
                  </th>
                </tr>
              </thead>
              <tbody className="[&amp;_tr:last-child]:border-0">
                <tr className="border-b transition-colors">
                  <td className="p-4 align-middle ">
                    <Skeleton className="w-[22px] max-w-full" />
                  </td>

                  <td className="p-4 align-middle">
                    <Skeleton className="w-[88px] max-w-full" />
                  </td>
                  <td className="p-4 align-middle flex flex-row gap-2">
                    <Skeleton className="w-[48px] max-w-full" />
                    <Skeleton className="w-[48px] max-w-full" />
                  </td>
                  <td className="p-4 align-middle text-right">
                    <Skeleton className="w-[32px] max-w-full" />
                  </td>
                </tr>
                <tr className="border-b transition-colors">
                  <td className="p-4 align-middle">
                    <Skeleton className="w-[22px] max-w-full" />
                  </td>

                  <td className="p-4 align-middle">
                    <Skeleton className="w-[48px] max-w-full" />
                  </td>
                  <td className="p-4 align-middle flex flex-row gap-2">
                    <Skeleton className="w-[48px] max-w-full" />
                    <Skeleton className="w-[48px] max-w-full" />
                  </td>
                  <td className="p-4 align-middle text-right">
                    <Skeleton className="w-[32px] max-w-full" />
                  </td>
                </tr>
                <tr className="border-b transition-colors">
                  <td className="p-4 align-middle ">
                    <Skeleton className="w-[22px] max-w-full" />
                  </td>

                  <td className="p-4 align-middle">
                    <Skeleton className="w-[88px] max-w-full" />
                  </td>
                  <td className="p-4 align-middle flex flex-row gap-2">
                    <Skeleton className="w-[48px] max-w-full" />
                    <Skeleton className="w-[48px] max-w-full" />
                  </td>
                  <td className="p-4 align-middle text-right">
                    <Skeleton className="w-[32px] max-w-full" />
                  </td>
                </tr>
                <tr className="border-b transition-colors">
                  <td className="p-4 align-middle">
                    <Skeleton className="w-[22px] max-w-full" />
                  </td>

                  <td className="p-4 align-middle">
                    <Skeleton className="w-[48px] max-w-full" />
                  </td>
                  <td className="p-4 align-middle flex flex-row gap-2">
                    <Skeleton className="w-[48px] max-w-full" />
                    <Skeleton className="w-[48px] max-w-full" />
                  </td>
                  <td className="p-4 align-middle text-right">
                    <Skeleton className="w-[32px] max-w-full" />
                  </td>
                </tr>
                <tr className="border-b transition-colors">
                  <td className="p-4 align-middle ">
                    <Skeleton className="w-[22px] max-w-full" />
                  </td>

                  <td className="p-4 align-middle">
                    <Skeleton className="w-[88px] max-w-full" />
                  </td>
                  <td className="p-4 align-middle flex flex-row gap-2">
                    <Skeleton className="w-[48px] max-w-full" />
                    <Skeleton className="w-[48px] max-w-full" />
                  </td>
                  <td className="p-4 align-middle text-right">
                    <Skeleton className="w-[32px] max-w-full" />
                  </td>
                </tr>
                <tr className="border-b transition-colors">
                  <td className="p-4 align-middle">
                    <Skeleton className="w-[22px] max-w-full" />
                  </td>

                  <td className="p-4 align-middle">
                    <Skeleton className="w-[48px] max-w-full" />
                  </td>
                  <td className="p-4 align-middle flex flex-row gap-2">
                    <Skeleton className="w-[48px] max-w-full" />
                    <Skeleton className="w-[48px] max-w-full" />
                  </td>
                  <td className="p-4 align-middle text-right">
                    <Skeleton className="w-[32px] max-w-full" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
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
                  <Button
                    variant="secondary"
                    onClick={() => handleUpdate(issue)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(issue)}
                  >
                    Delete
                  </Button>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={issue.show}
                    onCheckedChange={() => handleShowToggle(issue)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </main>
  );
}

export default Page;
