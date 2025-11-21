// frontend/api/db.js - Perubahan URI untuk Stabilitas Vercel

import mongoose from 'mongoose';

// Perhatian: Ganti MONGO_URI dengan MONGO_URI_BASE
const MONGO_URI_BASE = process.env.MONGO_URI_BASE; 

export const connectDB = async () => {
    
    // ... (Logika pengecekan readystate tetap sama)
    if (mongoose.connection.readyState >= 1) {
        console.log('MongoDB sudah terhubung.');
        return;
    }

    if (!MONGO_URI_BASE) {
        throw new Error("MONGO_URI_BASE is not defined in environment variables.");
    }

    try {
        // Gunakan URI BASE (tanpa nama database)
        await mongoose.connect(MONGO_URI_BASE); 
        console.log('MongoDB berhasil terhubung.');
    } catch (error) {
        // ... (Error handling tetap sama)
        throw error; 
    }
};