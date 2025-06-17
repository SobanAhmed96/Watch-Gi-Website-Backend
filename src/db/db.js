import mongoose from "mongoose";
import dbName from "../constant.js";

const dbConnection = async () => {
    try {
       const res = await mongoose.connect(`${process.env.DB_URI}/${dbName}`);
       console.log(`DB Connection Successfully !!! DB Host: ${res.connection.host} `);
    } catch (error) {
        console.log(`DB Error : ${error}`);
        
    }
}


export default dbConnection;