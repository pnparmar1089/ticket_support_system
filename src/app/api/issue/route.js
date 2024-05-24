// src/app/api/issue/route.js

import { connectToDatabase } from '@/utils/mongodb';
import Issue from '@/models/Issue';

export async function POST(req) {
  try {
    await connectToDatabase();

    const { name } = await req.json();

    if (!name) {
      return new Response(JSON.stringify({ error: 'Name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newIssue = new Issue({ name });
    await newIssue.save();

    return new Response(JSON.stringify(newIssue), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error saving issue' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const issues = await Issue.find({});
    return new Response(JSON.stringify(issues), {
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

export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { id } = await req.json();
    await Issue.findByIdAndDelete(id);
    return new Response(JSON.stringify({ message: 'Issue deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error deleting issue' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();
    const { id, name } = await req.json();
    const updatedIssue = await Issue.findByIdAndUpdate(id, { name }, { new: true });
    return new Response(JSON.stringify(updatedIssue), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error updating issue' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
