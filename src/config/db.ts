import mongoose from "mongoose";

export const connectDB = async (): Promise<mongoose.Connection> => {
  try {
    const user = encodeURIComponent(process.env.MONGO_USER as string);
    const password = encodeURIComponent(process.env.MONGO_PASSWORD as string);
    const appName = encodeURIComponent(process.env.MONGO_APP_NAME as string);
    const dbName = encodeURIComponent(process.env.MONGO_DB_NAME as string);
    const mongoURI = `mongodb+srv://${user}:${password}@expensetrackerapicluste.nzsdspm.mongodb.net/${dbName}?appName=${appName}`;
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected successfully");
    return mongoose.connection;
  } catch (error: any) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export const closeDB = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
};