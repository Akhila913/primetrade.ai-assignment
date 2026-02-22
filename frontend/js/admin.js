function getToken() {
    return localStorage.getItem("access_token");
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
}

async function protectAdmin() {
    const token = getToken();
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    const payload = parseJwt(token);

    if (payload.role !== "admin") {
        alert("Access denied.");
        window.location.href = "dashboard.html";
    }
}

async function loadUsers() {
    const container = document.getElementById("users-container");

    const users = await apiRequest("/admin/users", "GET");

    container.innerHTML = "";

    users.forEach(user => {
        const div = document.createElement("div");
        div.className = "task-item";

        div.innerHTML = `
            <strong>${user.email}</strong>
            <p>Role: ${user.role}</p>
            <p>Status: ${user.is_active ? "Active" : "Inactive"}</p>
        `;

        container.appendChild(div);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    await protectAdmin();
    await loadUsers();
});