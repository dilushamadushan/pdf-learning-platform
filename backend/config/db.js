import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.URL);
        console.log("Connected Successfully");
    } catch (error) {
        console.log("Error connecting to MongoDB");
    }
}

export default connectDB;