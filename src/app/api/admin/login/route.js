// pages/api/auth/login.js

import connectToDatabase from '@/utils/mongodb';
import Admin from '@/models/admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password } = body;

    await connectToDatabase();

    // console.log(username, password);

    // Find the user by username
    const admin = await Admin.findOne({ username });

    // console.log(user);

    // If user not found or password doesn't match, return error
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return new Response(JSON.stringify({ error: 'Invalid username or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET);

    admin.tokens.push(token);
    await admin.save();

    // Admin authenticated, return success with token
    return new Response(JSON.stringify({ message: 'Login successful', token }), {
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
