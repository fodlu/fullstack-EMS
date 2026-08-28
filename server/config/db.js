import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected successfully");
        });
        // await mongoose.connect(process.env.MONGODB_URI);
<<<<<<< HEAD
        await mongoose.connect("mongodb://localhost:27017/fullstackEMS");
=======
        await mongoose.connect(process.env.MONGODB_URI);
>>>>>>> 1c495c5f0cfe822b9f7afc3e1eefa095e58e0cdf
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
}

export default connectDB;