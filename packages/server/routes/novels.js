import express from 'express';
import Novel from '../models/Novel.js';
import Chapter from '../models/Chapter.js';
import { protect } from '../middleware/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.post('/', protect, asyncHandler(async (req, res) => {
    const { title, serie, synopsis, cover_image, novel_slug } = req.body;
    const newNovel = new Novel({
        title,
        serie,
        synopsis,
        cover_image,
        novel_slug
    });
    const savedNovel = await newNovel.save();
    res.status(201).json(savedNovel);
}));

router.get('/', asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.serie) {
        filter.serie = req.query.serie;
    }
    const novels = await Novel.find(filter, 'title serie novel_slug cover_image').sort({ createdAt: 1 });
    res.status(200).json(novels);
}));

router.get('/slug/:novelSlug', asyncHandler(async (req, res) => {
    const { novelSlug } = req.params;

    const novel = await Novel.findOne({ novel_slug: novelSlug });

    if (!novel) {
        return res.status(404).json({ message: 'Novel tidak ditemukan' });
    }

    const chapters = await Chapter.find({ novel: novel._id })
        .sort({ chapter_number: 1 })
        .select('title chapter_slug chapter_number');

    res.status(200).json({
        novel,
        chapters
    });
}));

router.get('/:id', asyncHandler(async (req, res) => {
    const novel = await Novel.findById(req.params.id);

    if (!novel) {
        return res.status(404).json({ message: 'Novel tidak ditemukan' });
    }

    res.status(200).json(novel);
}));

router.put('/:id', protect, asyncHandler(async (req, res) => {
    const novel = await Novel.findById(req.params.id);

    if (!novel) {
        return res.status(404).json({ message: 'Novel tidak ditemukan' });
    }
    
    novel.set(req.body);
    const updatedNovel = await novel.save(); 

    res.status(200).json(updatedNovel);
}));

router.delete('/:id', protect, asyncHandler(async (req, res) => {
    const novelId = req.params.id;
    const deletedNovel = await Novel.findByIdAndDelete(novelId);

    if (!deletedNovel) {
        return res.status(404).json({ message: 'Novel tidak ditemukan' });
    }
    await Chapter.deleteMany({ novel: novelId });
    res.status(200).json({ message: 'Novel dan semua chapter-nya berhasil dihapus' });
}));

export default router;