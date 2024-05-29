
import  connectToDatabase  from '@/utils/mongodb';
import issue from '@/models/issue';



export async function GET(req) {
  try {
    const url = new URL(req.url);
    const isp_name = url.searchParams.get('isp_name');
    await connectToDatabase();
    const issues = await issue.find({ show: true,isp_name });
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




