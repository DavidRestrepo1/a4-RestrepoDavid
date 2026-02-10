const username = localStorage.getItem("username");

// redirect if not logged in
if (!username) {
    window.location.href = "/login.html";
}

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const logoutBtn = document.getElementById("logoutBtn");

// logout
logoutBtn.onclick = () => {
    localStorage.clear();
    window.location.href = "/login.html";
};

// load tasks
async function loadTasks() {
    const res = await fetch(`/api/tasks?username=${username}`);
    const tasks = await res.json();
    render(tasks);
}

// render tasks
function render(tasks) {
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task.text;

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.onclick = () => deleteTask(task._id);

        li.appendChild(delBtn);
        taskList.appendChild(li);
    });
}

// add task
taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const text = taskInput.value.trim();
    if (!text) return;

    await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, username })
    });

    taskInput.value = "";
    loadTasks();
});

// delete task
async function deleteTask(id) {
    await fetch(`/api/tasks/${id}`, {
        method: "DELETE"
    });

    loadTasks();
}

loadTasks();
