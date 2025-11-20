import mongoose from "mongoose";

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

const Novel = mongoose.model("Novel", novelSchema);

export default Novel;