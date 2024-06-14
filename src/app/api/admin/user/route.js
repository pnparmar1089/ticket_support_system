import connectToDatabase from "@/utils/mongodb";
import user from "@/models/user";
import ticket from "@/models/ticket";


export async function GET(req) {
  try {
    const url = new URL(req.url);
    const isp_name = url.searchParams.get("isp_name");
    const username = url.searchParams.get("username");

    await connectToDatabase();

    let users;
    let tickets = [];

    if (username) {
      users = await user.find({ username }).sort({ createdAt: -1 });
      tickets = await ticket.find({ username }).sort({ createdAt: -1 });
      const response = {
        users,
        tickets,
      };
  
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      users = await user.find({ isp_name }).sort({ createdAt: -1 });
      return new Response(JSON.stringify(users), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error fetching issues" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const { username, password, name, email, Phone_num, ispname } =
      await req.json();

    // Validate required fields
    if (!username || !password || !name || !email || !Phone_num) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check if username already exists
    const existingUser = await user.findOne({ username });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "Username already exists" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
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
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error saving user" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { id } = await req.json();
  
    const userdata = await user.findOne({_id:id});

    await ticket.deleteMany({username:userdata.username});
    await user.findByIdAndDelete(id); 
    return new Response(
      JSON.stringify({ message: "user deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Error deleting user" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();

    const { id, ...updateData } = await req.json();
    // Check if username already exists
  
    const userdata = await user.findOne({_id:id});
    // Update the user document
    const updatedUser = await user.findByIdAndUpdate(id, updateData, {
      new: true,
    });

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
