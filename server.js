const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

const app = express();
const PORT = 3000;

// middleware
app.use(express.json());
app.use(express.static("public"));

// MongoDB
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

let usersCollection;
let tasksCollection;

async function startServer() {
    await client.connect();
    const db = client.db("assignment3");

    usersCollection = db.collection("users");
    tasksCollection = db.collection("tasks");

    app.listen(PORT, () =>
        console.log(`Server running at http://localhost:${PORT}`)
    );
}

startServer();

/* ---------- ROUTES ---------- */

// login page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/login.html"));
});

// app page
app.get("/app.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public/app.html"));
});

// login (create user if needed)
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    let user = await usersCollection.findOne({ username });

    if (!user) {
        await usersCollection.insertOne({ username, password });
    }

    res.sendStatus(200);
});

// get tasks for user
app.get("/tasks/:username", async (req, res) => {
    const tasks = await tasksCollection.find({
        username: req.params.username
    }).toArray();

    res.json(tasks);
});

// add task
app.post("/tasks", async (req, res) => {
    const task = {
        text: req.body.text,
        username: req.body.username
    };

    await tasksCollection.insertOne(task);
    res.json(task);
});

// update task
app.put("/tasks/:id", async (req, res) => {
    await tasksCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { text: req.body.text } }
    );

    res.sendStatus(200);
});

// delete task
app.delete("/tasks/:id", async (req, res) => {
    await tasksCollection.deleteOne({
        _id: new ObjectId(req.params.id)
    });

    res.sendStatus(200);
});
