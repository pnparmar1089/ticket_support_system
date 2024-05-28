import connectToDatabase from '@/utils/mongodb';
import ticket from '@/models/ticket';

export  async function POST(req, res) {
  await connectToDatabase();
     const body = await req.json();
    const { name, description, date, time, username, isp_name } = body;

    try {
      const newticket = new ticket({
        name,
        description,
        date,
        time,
        username,
        isp_name
      });

      await newticket.save();

      return new Response(JSON.stringify({ message: 'Ticket created successfully'}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  } 


  export async function GET(req) {
    try {
      const url = new URL(req.url);
      const username = url.searchParams.get('username');
     
      await connectToDatabase();
      const tickets = await ticket.find({username});
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


  
