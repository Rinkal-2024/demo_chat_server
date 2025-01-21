import mongoose from 'mongoose';

export const dbConnect = async () => {
    try{
        const conn =  await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Database connected: ${conn.connection.host}`);
    }catch(err){
        console.log("MONDODB connection" ,err);
    }   
}