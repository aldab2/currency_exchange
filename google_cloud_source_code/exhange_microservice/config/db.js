import { error } from "console";
import mongoose  from "mongoose";

const connectDB = async () =>{
    try {
        const conn = await mongoose.connect("mongodb+srv://XXXXXX:XXXXX?retryWrites=true&w=majority");
        //const conn = await mongoose.connect("mongodb+srv://serviceaccount:serviceaccount123@currency.lcwbwcw.mongodb.net/?retryWrites=true&w=majority");
        console.log(`MongoDB connected: ${conn.connection.host}:${conn.connection.port}`)
  
    }
    catch (error){
        console.error(`Error: ${error.message}`)
        process.exit(1);
    }
  }

export default connectDB;