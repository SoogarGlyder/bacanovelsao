import mongoose from 'mongoose';

const MONGO_URI_BASE = process.env.MONGO_URI_BASE; 

export const connectDB = async () => {
    
    if (mongoose.connection.readyState >= 1) {
        console.log('MongoDB sudah terhubung.');
        return;
    }

    if (!MONGO_URI_BASE) {
        throw new Error("MONGO_URI_BASE is not defined in environment variables.");
    }

    try {
        await mongoose.connect(MONGO_URI_BASE); 
        console.log('MongoDB berhasil terhubung.');
    } catch (error) {
        throw error; 
    }
};