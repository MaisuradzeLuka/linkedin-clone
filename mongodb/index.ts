import mongoose from "mongoose";

const connectionUrl = process.env.MONGODB_URL;

if (!connectionUrl) throw new Error("Please provide valid connection url");

const connectToDb = async () => {
  if (mongoose.connection?.readyState === 1) {
    console.log("Already connected to db");
    return;
  }

  try {
    await mongoose.connect(connectionUrl);
  } catch (error) {
    throw new Error(`Couldnt connect to db: ${error}`);
  }
};

export default connectToDb;
