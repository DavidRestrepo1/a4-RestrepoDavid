const username = localStorage.getItem("username");

// redirect if not logged in
if (!username) {
    window.location.href = "/login.html";
}

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const logoutBtn = document.getElementById("logoutBtn");

let editingId = null;

// logout
logoutBtn.onclick = () => {
    localStorage.clear();
    window.location.href = "/login.html";
};

// load tasks
async function loadTasks() {
    const username = localStorage.getItem("username");

    const res = await fetch(`/api/tasks?username=${username}`);
    const tasks = await res.json();

    render(tasks);
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const text = input.value.trim();
    const username = localStorage.getItem("username");

    if (!text) return;

    await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, username })
    });

    input.value = "";
    loadTasks();
});

async function deleteTask(id) {
    await fetch(`/api/tasks/${id}`, {
        method: "DELETE"
    });

    loadTasks();
}

async function updateTask(id, newText) {
    await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText })
    });

    loadTasks();
}

loadTasks();
