import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ Success connecting to MongoDB database.`);
    return true;
  } catch (error) {
    console.log(`❌ Error connecting to MongoDB database: ${error}`);
    process.exit(1);
  }
};
