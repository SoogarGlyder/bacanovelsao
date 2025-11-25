import express from 'express';
import cors from 'cors';
import { connectDB } from '../config/db.js'; 
import novelRoutes from '../routes/novels.js'; 
import chapterRoutes from '../routes/chapters.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('./api/novels', novelRoutes);
app.use('./api/chapters', chapterRoutes);

app.get('/', (req, res) => {
    res.status(200).send('API is running via Vercel Serverless Function.');
});

const PORT = process.env.PORT || 3030;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, async () => {
        console.log(`Express API berjalan di http://localhost:${PORT}`);

        try {
            await connectDB(); //
        } catch (error) {
            console.error('Koneksi MongoDB GAGAL total:', error.message);
        }
    });
}

export default async function handler(req, res) {
    
    try {
        await connectDB();
    } catch (error) {
        console.error('Database connection failed:', error);
        return res.status(500).json({ 
            error: 'Database connection failed. Check Vercel logs and MONGO_URI_BASE.' 
        });
    }
    
    return app(req, res);
}