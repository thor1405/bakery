import connectToDatabase from "./src/lib/mongodb.js";
import User from "./src/models/User.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

async function seedAdmin() {
  try {
    await connectToDatabase();
    
    const email = "admin@creamcaramel.com";
    const password = "securepassword123";
    
    let user = await User.findOne({ email });
    
    if (user) {
      console.log("Admin user already exists. You can log in with admin@creamcaramel.com / securepassword123");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      await User.create({
        name: "Admin",
        email: email,
        password: hashedPassword,
        role: "Admin",
      });
      console.log("Admin user created successfully! You can log in with admin@creamcaramel.com / securepassword123");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    mongoose.disconnect();
  }
}

seedAdmin();
