import connectToDatabase from '@/utils/mongodb';
import ticket from '@/models/ticket';


  export async function GET() {
    try {
      await connectToDatabase();
      const tickets = await ticket.find();
      return new Response(JSON.stringify(tickets), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Error fetching issues' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }


  
