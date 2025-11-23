import express from 'express';
import Chapter from './Chapter.js'
import Novel from './Novel.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { title , novel , chapter_number , content } = req.body;
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
        const novelId = req.params.novelId;
        const chapters = await Chapter.find({ novel: req.params.novelId }).sort({ chapter_number: 1 });
        res.status(200).json(chapters);

    } catch (error) {
        console.error('Error saat mengambil chapters by novel:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/:chapterId', async (req, res) => {
    try {
        const chapterId = req.params.chapterId;
        const chapter = await Chapter.findById(req.params.chapterId)
                                     .populate('novel', 'title serie');
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
    const {  title , novel , chapter_number , content  } = req.body;
    const chapterData = {  title , novel , chapter_number , content  };
    try {
        const updatedChapter = await Chapter.findByIdAndUpdate(
            req.params.id,
            chapterData,
            { new: true, runValidators: true }
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