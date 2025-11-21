import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import novelRoutes from './novels.js'; 
import chapterRoutes from './chapters.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/novels', novelRoutes);
app.use('/chapters', chapterRoutes);

app.get('/', (req, res) => {
    res.status(200).send('API is running via Vercel Serverless Function.');
});

et isConnected = false; 

export default async function handler(req, res) {
    if (!isConnected) {
        try {
            await connectDB();
            isConnected = true; 
        } catch (error) {
            console.error('Database connection failed:', error);
            return res.status(500).json({ error: 'Database connection failed' });
        }
    }
    return app(req, res);
}