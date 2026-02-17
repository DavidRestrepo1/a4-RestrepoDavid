import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: String,
    difficulty: String,
    createdAt: { type: Date, default: Date.now },
    dueDate: Date,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.model("Task", taskSchema);
