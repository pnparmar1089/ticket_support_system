import connectToDatabase from "@/utils/mongodb";
import user from "@/models/user";
import ticket from "@/models/ticket";
import Issue from "@/models/issue";

export async function GET(req) {
    
  try {
    const url = new URL(req.url);
    const isp_name = url.searchParams.get("isp_name");
    await connectToDatabase();

    const users = await user.find({ isp_name }).countDocuments();
    const tickets = await ticket.find({ isp_name }).countDocuments();
    const issues = await Issue.find({ isp_name }).countDocuments();  // Corrected to plural for consistency
    const response = {
      users,
      tickets,
      issues,  // Corrected to plural for consistency
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
