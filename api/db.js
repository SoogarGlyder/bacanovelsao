import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI; 

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log('MongoDB sudah terhubung (existing connection used).');
        return;
    }
    
    if (!MONGO_URI) {
        throw new Error("MONGO_URI is not defined in environment variables.");
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB berhasil terhubung.');
    } catch (error) {
        console.error('Koneksi MongoDB GAGAL:', error.message);
        throw error; 
    }
};