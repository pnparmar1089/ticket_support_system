  "use client"
  import { useState, useEffect, useContext, useCallback, useMemo } from "react";
  import axios from "axios";

  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Textarea } from "@/components/ui/textarea";

  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";

  import { useToast } from "@/components/ui/use-toast";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Separator } from "@/components/ui/separator";
  import { AuthContext } from "@/app/user/context/auth-context";
  import { ScrollArea } from "@/components/ui/scroll-area";

  function Page() {
    const [issues, setIssues] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [currentDate, setCurrentDate] = useState("");
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const { checkauth, username, ispname } = useContext(AuthContext);

    const fetchIssues = useCallback(async () => {
      try {
        const response = await axios.get("/api/user/issue", {
          params: {
            isp_name: ispname,
          },
        });
        setIssues(response.data);
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to load Issues!",
        });
      }
    }, [toast]);

    const fetchTickets = useCallback(async () => {
      try {
        const response = await axios.get("/api/user/ticket", {
          params: { username },
        });
        setTickets(response.data);
        // console.log(response.data);
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to load Tickets!",
        });
      }
    }, [toast, username]);

    useEffect(() => {
      checkauth();
      fetchTickets();
      fetchIssues();
    }, [checkauth, fetchIssues, fetchTickets]);

    useEffect(() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      setCurrentDate(`${year}-${month}-${day}`);
    }, []);

    const handleSubmit = async () => {
      if (!selectedIssue || !description || !date || !time) {
        toast({
          variant: "destructive",
          description: "Please fill in all fields!",
        });
        return;
      }

      try {
        await axios.post("/api/user/ticket/", {
          name: selectedIssue.name,
          description,
          date,
          time,
          username,
          isp_name: ispname,
        });

        toast({
          variant: "success",
          description: "Ticket created successfully",
        });

        // Reset form fields
        setDescription("");
        setDate("");
        setTime("");
        setIsDialogOpen(false); // Close the dialog
        fetchTickets(); // Fetch updated tickets list
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failed to create ticket!",
        });
      }
    };

    const closeTicket = async (ticketId) => {
      try {
        await axios.put(`/api/user/ticket/`,{
          id:  ticketId ,
          status : "close",
        });
        toast({
          variant: "success",
          description: "Ticket closed successfully",
        });
        fetchTickets(); // Refresh the tickets list
      } catch (error) {
        // console.log(error)
        toast({
          variant: "destructive",
          description: "Failed to close ticket!",
        });
      }
    };

    const formatDate = (isoString) => {
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${day}-${month}-${year}`;
    };

    // Memoize the open issue names
    const openIssueNames = useMemo(
      () => new Set(tickets.filter(ticket => ticket.status !== "close").map(ticket => ticket.name)),
      [tickets]
    );
    
    return (
      <main className="flex justify-center items-center flex-col p-2 px-4">
        <h2 className="text-xl text-center font-bold mb-4">
          What's wrong with you?
        </h2>

        <div className="flex flex-wrap justify-center items-center">
          {issues.map((issue) => (
            <Dialog
              key={issue._id}
              open={isDialogOpen && selectedIssue?._id === issue._id}
              onOpenChange={() => setIsDialogOpen(!isDialogOpen)}
            >
              <DialogTrigger
                onClick={() => {
                  setSelectedIssue(issue);
                  setIsDialogOpen(true);
                }}
                disabled={openIssueNames.has(issue.name)}
              >
                <Card
                  className={`m-5 ${
                    openIssueNames.has(issue.name) ? "opacity-50" : ""
                  }`}
                  aria-disabled={openIssueNames.has(issue.name)}
                >
                  <CardHeader>
                    <CardTitle className="text-xl">{issue.name}</CardTitle>
                  </CardHeader>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Problem: {issue.name}</DialogTitle>
                  <DialogDescription>
                    <p className="text-md mb-3">Give Description</p>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <p className="text-md my-3">Add Date</p>
                    <Input
                      type="date"
                      max={currentDate}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="flex justify-center items-center"
                    />
                    <p className="text-md my-3">Add Time</p>
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="flex justify-center items-center"
                    />
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="secondary"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>Open ticket</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ))}
        </div>
        {tickets.length > 0 && (
          <>
            <Separator className="my-3" />
            <h2 className="text-xl text-center font-bold my-4">
              Previously Open Tickets
            </h2>
            <div className="flex flex-wrap justify-center items-center">
              {tickets.map((ticket) => (
                <Card key={ticket._id} className="m-5">
                  <CardHeader>
                    <CardDescription>
                      Ticket Number :
                      <span className="font-bold italic">
                        {" "}
                        {ticket.ticketNumber}
                      </span>
                    </CardDescription>
                    <CardDescription>
                      {formatDate(ticket.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{ticket.name}</p>
                    <ScrollArea className="h-[150px] w-[300px] p-4">
                      {ticket.description}
                    </ScrollArea>
                  </CardContent>
                  <CardFooter>
                    <CardDescription>
                      Date: {ticket.date} , Time: {ticket.time}
                    </CardDescription>
                  </CardFooter>
                  <CardFooter className="flex justify-between">
                    <span className="font-medium italic">
                      status : {ticket.status}
                    </span>
                    { ticket.status !== "close" &&
                    <Button
                      className=""
                      variant="outline"
                      onClick={() => closeTicket(ticket._id)}
                    >
                      Close
                    </Button>}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    );
  }

  export default Page;
