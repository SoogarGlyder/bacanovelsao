import express from 'express';
import Novel from '../models/Novel.js';
import Chapter from '../models/Chapter.js';
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();

router.post('/', protect, async (req, res) => {
    try {
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
    } catch (error) {
        console.error('Error saat membuat novel:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.serie) {
            filter.serie = req.query.serie;
        }
        const novels = await Novel.find(filter, 'title serie novel_slug cover_image').sort({ createdAt: 1 });
        res.status(200).json(novels);
    } catch (error) {
        console.error('Error saat mengambil novel:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/find-first-chapter/:novelId', async (req, res) => {
  try {
    const novelId = req.params.novelId;

    const firstChapter = await Chapter.findOne({ novel: novelId })
                                      .sort({ chapter_number: 1 });

    if (!firstChapter) {
      return res.status(404).json({ message: 'Belum ada chapter untuk novel ini' });
    }

    res.status(200).json({ firstChapterSlug: firstChapter.chapter_slug }); 

  } catch (error) {
    console.error('Error saat mencari chapter pertama:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/:id', async (req, res) => {
    try {
        const novel = await Novel.findById(req.params.id);

        if (!novel) {
            return res.status(404).json({ message: 'Novel tidak ditemukan' })
        }

        res.status(200).json(novel);

    } catch (error) {
        console.error('Error saat mengambil satu novel:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/:id', protect, async (req, res) => {
    try {
        const novel = await Novel.findById(req.params.id);

        if (!novel) {
            return res.status(404).json({ message: 'Novel tidak ditemukan' });
        }
        
        novel.set(req.body);

        const updatedNovel = await novel.save(); 

        res.status(200).json(updatedNovel);
        
    } catch (error) {
        console.error('Error saat update novel:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

rrouter.delete('/:id', protect, async (req, res) => {
    try {
        const novelId = req.params.id;
        const deletedNovel = await Novel.findByIdAndDelete(novelId);

        if (!deletedNovel) {
            return res.status(404).json({ message: 'Novel tidak ditemukan' });
        }
        await Chapter.deleteMany({ novel: novelId });
        res.status(200).json({ message: 'Novel dan semua chapter-nya berhasil dihapus' });
    } catch (error) {
        console.error('Error saat menghapus novel:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;