import connectToDatabase from '@/utils/mongodb';
import ticket from '@/models/ticket';


  export async function GET(req) {
    try {
      const url = new URL(req.url);
      const isp_name = url.searchParams.get('isp_name');

      await connectToDatabase();
      const tickets = await ticket.find({isp_name}).sort({createdAt:-1});
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


  
