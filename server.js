const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

// ---------- Middleware ----------
app.use(express.json());
app.use(express.static("public"));

// ---------- Mongo Setup ----------
if (!uri) {
    console.error("MONGO_URI not set");
    process.exit(1);
}

const client = new MongoClient(uri);

let usersCollection;
let tasksCollection;

async function startServer() {
    try {
        await client.connect();
        console.log("MongoDB connected");

        const db = client.db("assignment3");
        usersCollection = db.collection("users");
        tasksCollection = db.collection("tasks");

        app.listen(PORT, () =>
            console.log(`Server running on port ${PORT}`)
        );
    } catch (err) {
        console.error("Mongo error:", err);
        process.exit(1);
    }
}

startServer();

// ---------- ROUTES ----------

// login page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/login.html"));
});

// app page
app.get("/app.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public/app.html"));
});

// login (auto-create user)
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    let user = await usersCollection.findOne({ username });

    if (!user) {
        await usersCollection.insertOne({ username, password });
    }

    res.sendStatus(200);
});

// get tasks for user
app.get("/api/tasks", async (req, res) => {
    const { username } = req.query;

    const tasks = await tasksCollection
        .find({ username })
        .toArray();

    res.json(tasks);
});

// add task
app.post("/api/tasks", async (req, res) => {
    const task = {
        text: req.body.text,
        username: req.body.username,
        createdAt: new Date()
    };

    await tasksCollection.insertOne(task);

    res.json(task);
});

// update task
app.put("/api/tasks/:id", async (req, res) => {
    await tasksCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { text: req.body.text } }
    );

    res.sendStatus(200);
});

// delete task
app.delete("/api/tasks/:id", async (req, res) => {
    await tasksCollection.deleteOne({
        _id: new ObjectId(req.params.id)
    });

    res.sendStatus(200);
});
