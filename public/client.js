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
    const res = await fetch(`/tasks/${username}`);
    const tasks = await res.json();

    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "flex justify-between items-center border p-2 rounded";

        const span = document.createElement("span");
        span.textContent = task.text;

        const buttons = document.createElement("div");
        buttons.className = "space-x-2";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "text-blue-500";
        editBtn.onclick = () => {
            taskInput.value = task.text;
            editingId = task._id;
        };

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.className = "text-red-500";
        delBtn.onclick = async () => {
            await fetch(`/tasks/${task._id}`, { method: "DELETE" });
            loadTasks();
        };

        buttons.append(editBtn, delBtn);
        li.append(span, buttons);
        taskList.append(li);
    });
}

// submit
taskForm.addEventListener("submit", async e => {
    e.preventDefault();

    if (editingId) {
        await fetch(`/tasks/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: taskInput.value })
        });
        editingId = null;
    } else {
        await fetch("/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text: taskInput.value,
                username
            })
        });
    }

    taskInput.value = "";
    loadTasks();
});

loadTasks();
