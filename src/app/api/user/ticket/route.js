import connectToDatabase from '@/utils/mongodb';
import ticket from '@/models/ticket';

export  async function POST(req, res) {
  await connectToDatabase();
     const body = await req.json();
    const { name, description, date, time } = body;

    try {
      const newticket = new ticket({
        name,
        description,
        date,
        time
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


  
