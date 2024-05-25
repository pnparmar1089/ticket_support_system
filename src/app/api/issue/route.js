
import  connectToDatabase  from '@/utils/mongodb';
import issue from '@/models/issue';

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

    const newissue = new issue({ name });
    await newissue.save();

    return new Response(JSON.stringify(newissue), {
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
    const issues = await issue.find({});
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
    await issue.findByIdAndDelete(id);
    return new Response(JSON.stringify({ message: 'issue deleted successfully' }), {
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
    const { id, name, show } = await req.json();
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (show !== undefined) updateData.show = show;
    const updatedissue = await issue.findByIdAndUpdate(id, updateData, { new: true });
    return new Response(JSON.stringify(updatedissue), {
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

