import mongoose from "mongoose";

const connectDB = async () => {

  mongoose.connection.on('connected', () => console.log("wordautomate Database Connected"));

 
  mongoose.connection.on('error', (err) => console.log("Database Connection Error", err));

  await mongoose.connect(process.env.MONGODB_URI);
};

export default connectDB;