import express from 'express';
import cors from 'cors';
import { connectDB } from '../config/db.js'; 
import novelRoutes from '../routes/novels.js'; 
import chapterRoutes from '../routes/chapters.js';
import errorHandler from '../middleware/errorMiddleware.js';
import sitemapRoutes from '../routes/sitemap.js';

const app = express();

app.use(cors());
app.use(express.json());

const ensureDBConnection = async (req, res, next) => {
    try {
        await connectDB(); 
        next();
    } catch (error) {
        console.error('Database connection failed:', error);
        return res.status(503).json({ 
            error: 'Service Unavailable. Database connection failed.',
            details: error.message 
        });
    }
};

app.use(ensureDBConnection);

app.use('/api/novels', novelRoutes);
app.use('/api/chapters', chapterRoutes);

app.use('/sitemap.xml', sitemapRoutes);

app.get('/', (req, res) => {
    res.status(200).send('API is running via Vercel Serverless Function.');
});

app.use(errorHandler);

const PORT = process.env.PORT || 3030;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, async () => {
        console.log(`Express API berjalan di http://localhost:${PORT}`);
        try {
            await connectDB();
        } catch (error) {
            console.error('Koneksi MongoDB GAGAL total:', error.message);
        }
    });
}

export default async function handler(req, res) {
    return app(req, res);
}