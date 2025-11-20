import mongoose from 'mongoose';

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log('MongoDB is already connected.');
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, 
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connecting is Error: ${error.message}`);
    }
};