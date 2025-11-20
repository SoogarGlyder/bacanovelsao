import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
    novel:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Novel",
        required: true
    },
    title: {
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

const Chapter = mongoose.model("Chapter", chapterSchema);

export default Chapter;