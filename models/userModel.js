import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    password: String,
    username: String,
    email: String,
    salary: Number,
    salarySubtraction: Boolean
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
