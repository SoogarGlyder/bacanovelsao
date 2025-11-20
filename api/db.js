import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI; 

export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log('✅ MongoDB sudah terhubung.');
        return;
    }

    if (!MONGO_URI) {
        throw new Error('MONGO_URI belum diatur. Harap tambahkan di Vercel Environment Variables.');
    }

    try {
        await mongoose.connect(MONGO_URI, {
        });
        console.log('🚀 Koneksi MongoDB berhasil dibuat!');
    } catch (error) {
        console.error('❌ Gagal terhubung ke MongoDB:', error.message);
        throw error; 
    }
};