import express from 'express';
import Chapter from '../models/Chapter.js';
import Novel from '../models/Novel.js';
import { protect } from '../middleware/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.post('/', protect, asyncHandler(async (req, res) => {
    const { title, novel, chapter_slug, chapter_number, content } = req.body; 
    
    if (!novel) {
        return res.status(400).json({ message: 'Novel ID (novel) wajib disertakan' });
    }
    const existingNovel = await Novel.findById(novel);
    if (!existingNovel) {
        return res.status(404).json({ message: 'Novel tidak ditemukan' });
    }
    
    const newChapter = new Chapter({
        title,
        novel: novel,
        chapter_slug,
        chapter_number,
        content
    });
    const savedChapter = await newChapter.save();
    res.status(201).json(savedChapter);
}));

router.get('/all', asyncHandler(async (req, res) => {
    const chapters = await Chapter.find({})
        .populate('novel', 'title serie novel_slug') 
        .sort({ chapter_number: 1 }); 
        
    res.status(200).json(chapters);
}));

router.get('/novel/:novelId', asyncHandler(async (req, res) => {
    const chapters = await Chapter.find({ novel: req.params.novelId },
        'title chapter_slug chapter_number').sort({ chapter_number: 1 });
    res.status(200).json(chapters);
}));

router.get('/slug/:chapterSlug', asyncHandler(async (req, res) => {
    const chapterSlug = req.params.chapterSlug;
    const novelSlug = req.query.novelSlug;

    const novelInfo = await Novel.findOne({ novel_slug: novelSlug }, '_id');

    if (!novelInfo) {
        return res.status(404).json({ message: 'Novel tidak ditemukan berdasarkan slug' });
    }

    const [chapter, allChaptersList] = await Promise.all([
        Chapter.findOne({ 
            novel: novelInfo._id, 
            chapter_slug: chapterSlug 
        }).populate('novel', 'title serie novel_slug'),
        
        Chapter.find({ novel: novelInfo._id }, 'title chapter_slug chapter_number')
               .sort({ chapter_number: 1 })
    ]);

    if (!chapter) {
        return res.status(404).json({ message: 'Chapter tidak ditemukan' });
    }

    res.status(200).json({ 
        chapterDetail: chapter, 
        allChapters: allChaptersList 
    });
}));

router.get('/:chapterId', asyncHandler(async (req, res) => {
    const chapter = await Chapter.findById(req.params.chapterId)
                                 .populate('novel', 'title serie novel_slug'); 
    if (!chapter) {
        return res.status(404).json({ message: 'Chapter tidak ditemukan' });
    }
    res.status(200).json(chapter);
}));

router.put('/:id', protect, asyncHandler(async (req, res) => {
    const { title, novel, chapter_slug, chapter_number, content } = req.body;
    const chapterData = { title, novel, chapter_slug, chapter_number, content };
    
    const updatedChapter = await Chapter.findByIdAndUpdate(
        req.params.id,
        chapterData,
        { 
            new: true, 
            runValidators: true,
            populate: {
                path: 'novel',
                select: 'title serie novel_slug' 
            }
        }
    );

    if (!updatedChapter) {
        return res.status(404).json({ message: 'Chapter tidak ditemukan' });
    }

    res.status(200).json(updatedChapter);
}));

router.delete('/:id', protect, asyncHandler(async (req, res) => {
    const deletedChapter = await Chapter.findByIdAndDelete(req.params.id);
    if (!deletedChapter) {
        return res.status(404).json({ message: 'Chapter tidak ditemukan' });
    }
    res.status(200).json({ message: 'Chapter berhasil dihapus' });
}));

export default router;