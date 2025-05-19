import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    password: String
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
