import mongoose from "mongoose";

const BillSchema = new mongoose.Schema({
    userId: String,
    cardId: String,
    title: String,
    value: Number,
    installments: Number,
    billType: String,
    finalDate: Date
}, { timestamps: true });

export default mongoose.model('Bill', BillSchema);
