const http = require("node:http");
const fs = require("node:fs");
const mime = require("mime");

const port = 3000;
const publicDir = "public/";

let tasks = [];

const server = http.createServer((req, res) => {

    //API ROUTES
    if (req.url === "/api/tasks" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(tasks));
        return;
    }

    if (req.url === "/api/tasks" && req.method === "POST") {
        let body = "";

        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            const data = JSON.parse(body);

            const created = new Date();
            const deadline = calculateDeadline(created, data.priority);

            tasks.push({
                task: data.task,
                priority: data.priority,
                hours: data.hours,
                created: created.toDateString(),
                deadline: deadline
            });

            res.writeHead(200);
            res.end("Task added");
        });
        return;
    }

    if (req.url.startsWith("/api/tasks/") && req.method === "DELETE") {
        const index = parseInt(req.url.split("/").pop());
        tasks.splice(index, 1);

        res.writeHead(200);
        res.end("Deleted");
        return;
    }

    //UPDATE EXISTING TASK
    if (req.url.startsWith("/api/tasks/") && req.method === "PUT") {
        const index = parseInt(req.url.split("/").pop());
        let body = "";

        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            const data = JSON.parse(body);

            const created = new Date(tasks[index].created);
            const deadline = calculateDeadline(created, data.priority);

            tasks[index] = {
                task: data.task,
                priority: data.priority,
                hours: data.hours,
                created: tasks[index].created,
                deadline: deadline
            };

            res.writeHead(200);
            res.end("Updated");
        });
        return;
    }

    //STATIC FILES
    const cleanUrl = req.url.split("?")[0];
    let filePath = cleanUrl === "/" ? "index.html" : cleanUrl.slice(1);
    filePath = "public/" + filePath;

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error("FILE NOT FOUND:", filePath);
            res.writeHead(404);
            res.end("404 Not Found");
        } else {
            res.writeHead(200, { "Content-Type": mime.getType(filePath) });
            res.end(data);
        }
    });

});

//DERIVED FIELD FUNCTION
function calculateDeadline(created, priority) {
    const days = priority == 1 ? 7 :
        priority == 2 ? 5 :
            priority == 3 ? 3 : 1;

    const d = new Date(created);
    d.setDate(d.getDate() + days);
    return d.toDateString();
}

server.listen(process.env.PORT || port, () => {
    console.log("Server running on port", port);
});
