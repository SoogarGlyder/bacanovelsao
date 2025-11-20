import mongoose from 'mongoose';

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log('MongoDB is already connected.');
        return;
    }

};