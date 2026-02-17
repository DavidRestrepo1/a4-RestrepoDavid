import express from "express";
import Task from "../models/Task.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

function calculateDueDate(difficulty) {
    const now = new Date();
    if (difficulty === "Easy") now.setDate(now.getDate() + 2);
    if (difficulty === "Medium") now.setDate(now.getDate() + 5);
    if (difficulty === "Hard") now.setDate(now.getDate() + 10);
    return now;
}

router.get("/", auth, async (req, res) => {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
});

router.post("/", auth, async (req, res) => {
    const dueDate = calculateDueDate(req.body.difficulty);

    const task = new Task({
        title: req.body.title,
        difficulty: req.body.difficulty,
        dueDate,
        user: req.user.id
    });

    await task.save();
    res.json(task);
});

router.delete("/:id", auth, async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
});

export default router;
