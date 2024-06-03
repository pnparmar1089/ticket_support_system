import connectToDatabase from '@/utils/mongodb';
import user from '@/models/user';


  export async function GET(req) {
    try {
      const url = new URL(req.url);
      const isp_name = url.searchParams.get('isp_name');

      await connectToDatabase();
      const users = await user.find({isp_name}).sort({createdAt:-1});
      return new Response(JSON.stringify(users), {
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


  export async function POST(req) {
    try {
      await connectToDatabase();
      const { username, password, name, email, Phone_num, ispname } = await req.json();
  
      // Validate required fields
      if (!username || !password || !name || !email || !Phone_num) {
        return new Response(JSON.stringify({ error: 'All fields are required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Check if username already exists
      const existingUser = await user.findOne({ username });
      if (existingUser) {
          return new Response(JSON.stringify({ error: 'Username already exists' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
          });
      }
  
      // Create a new user
      const newUser = new user({
        username,
        password,
        name,
        email,
        Phone_num,
        isp_name: ispname,
      });
  
      await newUser.save();
  
      return new Response(JSON.stringify(newUser), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'Error saving user' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }


  export async function DELETE(req) {
    try {
      await connectToDatabase();
      const  {id}  = await req.json();
      await user.findByIdAndDelete(id);
      return new Response(JSON.stringify({ message: 'user deleted successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.log(error)
      return new Response(JSON.stringify({ error: 'Error deleting user' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }  


  export async function PUT(req) {
    try {
      await connectToDatabase();
  
      const { id, ...updateData } = await req.json();
      // Check if username already exists
      const existingUser = await user.findOne({ username : updateData.username });
      if (existingUser) {
          return new Response(JSON.stringify({ error: 'Username already exists' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
          });
      }
      // Update the user document
      const updatedUser = await user.findByIdAndUpdate(id, updateData, { new: true });
      
      if (!updatedUser) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      return new Response(JSON.stringify(updatedUser), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: "Error updating user" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
