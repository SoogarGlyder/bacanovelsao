import mongoose from "mongoose";

const generateSlug = (text) => {
    return text.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

const novelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    serie: {
        type: String,
        required: true
    },
    novel_slug: {
        type: String,
        unique: true,
        required: true
    },
    synopsis: {
        type: String,
        required: false
    },
    cover_image: {
        type: String,
        required: false
    },
}, {
    timestamps: true
});

novelSchema.pre('validate', function(next) {
    if (this.isModified('title') || (this.isNew && !this.novel_slug)) {
        this.novel_slug = generateSlug(this.title); 
    } else if (this.isModified('novel_slug')) {
        this.novel_slug = generateSlug(this.novel_slug);
    }
    next();
});

const Novel = mongoose.model("Novel", novelSchema);

export default Novel;