import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    console.log(process.env.MONGO_URI);
    const dbUri =
      process.env.MONGO_URI || "mongodb://localhost:27017/shortener";

    await mongoose.connect(dbUri);
    console.log("MongoDB connected successfully");

    // Optional: Add connection event listeners
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDatabase;
