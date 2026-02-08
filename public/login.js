const form = document.getElementById("loginForm");

form.addEventListener("submit", async e => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    window.location.href = "/app.html";
});
