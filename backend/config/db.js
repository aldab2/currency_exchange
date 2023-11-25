import { error } from "console";
import mongoose  from "mongoose";

const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}:${conn.connection.port}`)

        //TODO Insure Dollar is in DB
    }
    catch (error){
        console.error(`Error: ${error.message}`)
        process.exit(1);
    }

}

export default connectDB;