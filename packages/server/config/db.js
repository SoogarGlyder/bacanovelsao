import mongoose from 'mongoose';

const MONGO_URI_BASE = process.env.MONGO_URI_BASE; 

let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
    
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    if (cached.conn) {
        return cached.conn;
    }

    if (!MONGO_URI_BASE) {
        throw new Error("MONGO_URI_BASE is not defined in environment variables.");
    }
    
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI_BASE).then(mongoose => {
            return mongoose;
        }).catch(error => {
            cached.promise = null;
            throw error;
        });
    }

    cached.conn = await cached.promise;
    console.log('MongoDB berhasil terhubung.');
    return cached.conn;
};