window.onload = () => {
    document.querySelector("#taskForm").onsubmit = addTask;
    loadTasks();
};

async function loadTasks() {
    const res = await fetch("/api/tasks");
    const data = await res.json();

    const table = document.querySelector("#results");
    table.innerHTML = "";

    data.forEach((task, i) => {
        table.innerHTML += `
      <tr>
        <td>${task.task}</td>
        <td>${task.priority}</td>
        <td>${task.hours}</td>
        <td>${task.created}</td>
        <td>${task.deadline}</td>
        <td><button onclick="deleteTask(${i})">X</button></td>
      </tr>
    `;
    });
}

async function addTask(e) {
    e.preventDefault();

    const body = JSON.stringify({
        task: task.value,
        priority: priority.value,
        hours: hours.value
    });

    await fetch("/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    });

    loadTasks();
    e.target.reset();
}


async function deleteTask(i) {
    await fetch(`/api/tasks/${i}`, { method: "DELETE" });
    loadTasks();
}

function loadTasks() {
    fetch("/api/tasks")
        .then(res => res.json())
        .then(data => {
            const table = document.querySelector("#results");
            table.innerHTML = "";

            data.forEach((t, i) => {
                table.innerHTML += `
          <tr>
            <td>${t.task}</td>
            <td>${t.priority}</td>
            <td>${t.hours}</td>
            <td>${t.created}</td>
            <td>${t.deadline}</td>
            <td>
              <button onclick="editTask(${i})">Edit</button>
              <button onclick="deleteTask(${i})">Delete</button>
            </td>
          </tr>
        `;
            });
        });
}

function editTask(index) {
    const task = prompt("Task name:");
    const priority = prompt("Priority (1–4):");
    const hours = prompt("Hours needed:");

    if (!task || !priority || !hours) return;

    fetch(`/api/tasks/${index}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, priority, hours })
    }).then(() => loadTasks());
}
