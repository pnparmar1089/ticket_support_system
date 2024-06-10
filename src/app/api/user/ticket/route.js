import connectToDatabase from '@/utils/mongodb';
import ticket from '@/models/ticket';
import axios from 'axios';
import User from '@/models/user';

export async function POST(req, res) {
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

    //send mail
    const userdata = await User.find({username:username});
    
    const html = `<h2>Hello, ${userdata.name}</h2>
                  <br/>
                  <h2>Your Ticket create Successfully.</h2>
                  <h3><strong>Issue Name : </strong>${name} </h3>
                  <h3><strong>Issue Description : </strong>${description} </h3>
                  <h3><strong>Ticket Number : </strong><i>${newticket.ticketNumber} </i></h3>`;
    const email = userdata[0].email;
    const subject = "TSM New Ticket Created";

    await axios.post(`${process.env.BASE_URL}/api/sendmail`, {
      email,
      subject,
      html
    });

    return new Response(JSON.stringify({ message: 'Ticket created successfully' }), {
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
    const tickets = await ticket.find({ username }).sort({ createdAt: -1 });
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

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, status } = body;
    await connectToDatabase();

    const tickets = await ticket.findById(id);

    if (!tickets) {
      return new Response(JSON.stringify({ message: 'Ticket not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    tickets.status = status;
    await tickets.save();
    //send mail
    const userdata = await User.find({username:tickets.username});
    
    const html = `<h2>Hello, ${userdata.name}</h2>
                  <br/>
                  <h2>Your Ticket Closed Successfully.</h2>
                  <h3><strong>Issue Name : </strong>${tickets.name} </h3>
                  <h3><strong>Ticket Number : </strong><i>${tickets.ticketNumber} </i></h3>`;
    const email = userdata[0].email;
    const subject = "TSM Ticket Closed";

    await axios.post(`${process.env.BASE_URL}/api/sendmail`, {
      email,
      subject,
      html
    });

    return new Response(JSON.stringify({ message: 'Ticket closed successfully', tickets }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Failed to close ticket', error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
