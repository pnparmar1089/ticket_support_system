
import  connectToDatabase  from '@/utils/mongodb';
import issue from '@/models/issue';



export async function GET() {
  try {
    await connectToDatabase();
    const issues = await issue.find({ show: true });
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




