import express from 'express';
import { generateSitemap } from '../controllers/sitemapController.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.get('/', asyncHandler(generateSitemap));

export default router;