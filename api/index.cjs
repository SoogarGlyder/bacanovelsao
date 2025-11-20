// import express from 'express';
// import cors from 'cors';
// import { connectDB } from './db.cjs';
// import novelRoutes from './novels.cjs'; 
// import chapterRoutes from './chapters.cjs';

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { connectDB } = require('./db.cjs'); 
const novelRoutes = require('./novels.cjs'); 
const chapterRoutes = require('./chapters.cjs');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/novels', novelRoutes);
app.use('/chapters', chapterRoutes);

app.get('/api', (req, res) => {
    res.status(200).send('API is running via Vercel Serverless Function.');
});
// export default async (req, res) => {
module.exports = async (req, res) => {
    await connectDB(); 
    return app(req, res); 
};