import connectToDatabase from "@/utils/mongodb";
import ticket from "@/models/ticket";


export async function GET(req) {
    
  try {
    const url = new URL(req.url);
    const username = url.searchParams.get("user_name");
    await connectToDatabase();
    const tickets = await ticket.find({ username }).countDocuments();
    const opentickets = await ticket.find({username,status:"open"}).countDocuments();
    const solvedtickets = await ticket.find({username,status:"solved"}).countDocuments();
    const workingtickets = await ticket.find({username,status:"working"}).countDocuments();
    const closetickets = await ticket.find({username,status:"close"}).countDocuments();
    const response = {
      
      tickets,
      solvedtickets,
workingtickets,
closetickets,
      opentickets,
        // Corrected to plural for consistency
    };
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error fetching data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
