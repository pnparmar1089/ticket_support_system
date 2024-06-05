import connectToDatabase from '@/utils/mongodb';
import ticket from '@/models/ticket';
import User from '@/models/user';


  export async function GET(req) {
    try {
      const url = new URL(req.url);
      const isp_name = url.searchParams.get('isp_name');
      const id = url.searchParams.get('id');
      await connectToDatabase();
      let query;
      let user_query;
    if (id) {
      query = ticket.find({_id:id}).sort({createdAt:-1});
      const tickets = await query;
      user_query = User.find({username:tickets[0].username})
      const user = await user_query;
      
      return new Response(JSON.stringify({tickets,user}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      query = ticket.find({isp_name}).sort({createdAt:-1});
      const tickets = await query;
      return new Response(JSON.stringify(tickets), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
      
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Error fetching issues' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }


  
  export async function PUT(req) {
    try {
      const body = await req.json();
      const { id, status, comment } = body;
      if (!id || !status || comment === undefined) {
        return new Response(JSON.stringify({ message: 'Invalid input' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      await connectToDatabase();
      
      const ticketdata = await ticket.findById(id);
  
      if (!ticketdata) {
        return new Response(JSON.stringify({ message: 'Ticket not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      ticketdata.status = status;
      ticketdata.comment = comment;
      await ticketdata.save();
  
      return new Response(JSON.stringify({ message: 'Ticket updated successfully', ticketdata }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      
      return new Response(JSON.stringify({ message: 'Failed to update ticket', error }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  

  
