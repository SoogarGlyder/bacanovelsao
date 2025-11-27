import mongoose from 'mongoose';

const generateSlug = (text) => {
    return text.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

const chapterSchema = new mongoose.Schema({
    novel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Novel",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    chapter_slug: {
        type: String,
        required: true
    },
    chapter_number: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: false
    },
}, {
    timestamps: true
});

chapterSchema.pre('validate', function(next) {
    if (this.isModified('title') || (this.isNew && !this.chapter_slug)) {
        this.chapter_slug = generateSlug(this.title); 
    } else if (this.isModified('chapter_slug')) {
        this.chapter_slug = generateSlug(this.chapter_slug);
    }
    next();
});

const Chapter = mongoose.model("Chapter", chapterSchema);

export default Chapter;