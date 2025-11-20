import express from 'express';
import cors from 'cors';
import { connectDB } from './db';
import { novelRoutes } from './novels'; 
import { chapterRoutes } from './chapters';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/novels', novelRoutes);
app.use('/chapters', chapterRoutes);

app.get('/api', (req, res) => {
    res.status(200).send('API is running via Vercel Serverless Function.');
});
export default async (req, res) => {
    await connectDB(); 
    return app(req, res); 
};