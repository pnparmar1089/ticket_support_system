// pages/api/auth/logout.js

import connectToDatabase from '@/utils/mongodb';
import User from '@/models/user';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const body = await req.json();
    const { token } = body;

    await connectToDatabase();

    // Verify the token to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Find the user and remove the token from their tokens array
    const user = await User.findById(userId);
   
    if (user) {
      user.tokens = user.tokens.filter((t) => t !== token);
      await user.save();
    }

    return new Response(JSON.stringify({ message: 'Logout successful' }), {
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
