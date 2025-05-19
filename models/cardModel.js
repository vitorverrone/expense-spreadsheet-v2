import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
    userId: String,
    nickname: String,
    closingDay: Number,
}, { timestamps: true });

export default mongoose.model('Card', CardSchema);
