// pages/api/auth/checkauth.js

import connectToDatabase from '@/utils/mongodb';
import User from '@/models/user';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const body = await req.json();
    const { token } = body;

    await connectToDatabase();

    // Verify the token to get the user ID
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const userId = decoded.userId;
    

    // Find the user and check if the token exists in their tokens array
    const user = await User.findById(userId);

    if (user && user.tokens.includes(token)) {
      const { username, email, Phone_num , isp_name} = user;
      return new Response(JSON.stringify({ username, email, Phone_num, isp_name }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    // console.error(error);
    
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
