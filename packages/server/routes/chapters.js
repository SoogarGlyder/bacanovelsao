import express from 'express';
import Chapter from '../models/Chapter.js'
import Novel from '../models/Novel.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
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

    } catch (error) {
        console.error('Error saat membuat chapter:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/novel/:novelId', async (req, res) => {
    try {
        const chapters = await Chapter.find({ novel: req.params.novelId }, 'title chapter_slug chapter_number').sort({ chapter_number: 1 });
        res.status(200).json(chapters);

    } catch (error) {
        console.error('Error saat mengambil chapters by novel:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/slug/:chapterSlug', async (req, res) => {
    try {
        const chapterSlug = req.params.chapterSlug;
        const novelSlug = req.query.novelSlug;

        const novelInfo = await Novel.findOne({ novel_slug: novelSlug }, '_id');

        if (!novelInfo) {
            return res.status(404).json({ message: 'Novel tidak ditemukan berdasarkan slug' });
        }

        const chapter = await Chapter.findOne({ 
            novel: novelInfo._id, 
            chapter_slug: chapterSlug 
        })
        .populate('novel', 'title serie novel_slug');

        if (!chapter) {
            return res.status(404).json({ message: 'Chapter tidak ditemukan' });
        }
        res.status(200).json(chapter);

    } catch (error) {
        console.error('Error saat mengambil chapter dengan slug gabungan:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/:chapterId', async (req, res) => {
    try {
        const chapterId = req.params.chapterId;
        const chapter = await Chapter.findById(req.params.chapterId)
                                     .populate('novel', 'title serie novel_slug'); 
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter tidak ditemukan' });
        }
        res.status(200).json(chapter);

    } catch (error) {
        console.error('Error saat mengambil satu chapter:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/:id', async (req, res) => {
    const { title, novel, chapter_slug, chapter_number, content } = req.body;
    const chapterData = { title, novel, chapter_slug, chapter_number, content };
    
    try {
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

    } catch (error) {
        console.error('Error saat update chapter:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedChapter = await Chapter.findByIdAndDelete(req.params.id);
        if (!deletedChapter) {
            return res.status(404).json({ message: 'Chapter tidak ditemukan' });
        }
        res.status(200).json({ message: 'Chapter berhasil dihapus' });
    } catch (error) {
        console.error('Error saat menghapus chapter:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;