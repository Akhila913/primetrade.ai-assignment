function getToken() {
    return localStorage.getItem("access_token");
}

function logout() {
    localStorage.removeItem("access_token");
    window.location.href = "index.html";
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
}

async function loadTasks() {
    try {
        const container = document.getElementById("tasks-container");
        const heading = document.getElementById("tasks-heading");

        const token = getToken();
        if (!token) return;

        const payload = parseJwt(token);

        if (heading) {
            heading.innerText =
                payload.role === "admin"
                    ? "All Users Tasks"
                    : "Your Tasks";
        }

        container.innerHTML = "Loading...";

        const tasks = await apiRequest("/tasks", "GET");

        container.innerHTML = "";

        if (!tasks || tasks.length === 0) {
            container.innerHTML = "<p>No tasks yet.</p>";
            return;
        }

        tasks.forEach(task => {
            const div = document.createElement("div");
            div.className = "task-item";

            const canModify =
                payload.role === "admin" ||
                task.owner_id === payload.sub;

            div.innerHTML = `
                <div class="task-content" id="content-${task.id}">
                    <strong>${task.title}</strong>
                    <p>${task.description || ""}</p>
                    ${
                        payload.role === "admin"
                            ? `<small class="task-owner">
                                Owner: ${task.owner_id}
                              </small>`
                            : ""
                    }
                </div>
                <div class="task-actions">
                    ${
                        canModify
                            ? `
                            <button class="edit-btn" onclick="enableEdit('${task.id}', '${task.title}', \`${task.description || ""}\`)">Edit</button>
                            <button class="delete-btn" onclick="deleteTask('${task.id}')">Delete</button>
                            `
                            : ""
                    }
                </div>
            `;

            container.appendChild(div);
        });
    } catch (error) {
        console.error("Load tasks error:", error);
    }
}

async function createTask() {
    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-description").value;

    await apiRequest("/tasks", "POST", { title, description });
    showToast("Task created successfully");

    document.getElementById("task-title").value = "";
    document.getElementById("task-description").value = "";

    loadTasks();
}

let taskToDelete = null;

function deleteTask(id) {
    taskToDelete = id;
    document.getElementById("delete-modal").classList.remove("hidden");
}

function closeModal() {
    taskToDelete = null;
    document.getElementById("delete-modal").classList.add("hidden");
}


function showEditForm(id, title, description) {
    const newTitle = prompt("Update title:", title);
    if (!newTitle) return;

    updateTask(id, newTitle);
}

async function updateTask(id, title) {
    await apiRequest(`/tasks/${id}`, "PUT", { title });
    loadTasks();
}

function protectRoute() {
    const token = getToken();
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    const payload = parseJwt(token);

    const roleEl = document.getElementById("user-role");
    const adminBadge = document.getElementById("admin-badge");
    const headerActions = document.getElementById("header-actions");

    roleEl.innerText = payload.role.toUpperCase();

    adminBadge.classList.add("hidden");

    const existingAdminBtn = document.getElementById("admin-btn");
    if (existingAdminBtn) {
        existingAdminBtn.remove();
    }

    if (payload.role === "admin") {
        roleEl.style.color = "#e53935";
        adminBadge.classList.remove("hidden");

        const btn = document.createElement("button");
        btn.innerText = "Admin Panel";
        btn.className = "primary-btn";
        btn.id = "admin-btn";
        btn.onclick = () => window.location.href = "admin.html";

        headerActions.appendChild(btn);
    }
}

function goToAdmin() {
    window.location.href = "admin.html";
}

function enableEdit(id, title, description) {
    const container = document.getElementById(`content-${id}`);

    container.innerHTML = `
        <input type="text" id="edit-title-${id}" value="${title}" class="edit-input">
        <textarea id="edit-desc-${id}" class="edit-textarea">${description}</textarea>
        <div class="edit-actions">
            <button onclick="saveEdit('${id}')" class="primary-btn">Save</button>
            <button onclick="loadTasks()" class="cancel-btn">Cancel</button>
        </div>
    `;
}

async function saveEdit(id) {
    const newTitle = document.getElementById(`edit-title-${id}`).value;
    const newDesc = document.getElementById(`edit-desc-${id}`).value;

    await apiRequest(`/tasks/${id}`, "PUT", {
        title: newTitle,
        description: newDesc
    });
    showToast("Task updated successfully");

    loadTasks();
}

function showToast(message, isError = false) {
    const toast = document.getElementById("toast");
    toast.innerText = message;

    toast.classList.remove("hidden", "error");
    toast.classList.add("show");

    if (isError) {
        toast.classList.add("error");
    }

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
    protectRoute();
    loadTasks();

    const confirmBtn = document.getElementById("confirm-delete");
    if (confirmBtn) {
        confirmBtn.addEventListener("click", async () => {
            if (!taskToDelete) return;

            await apiRequest(`/tasks/${taskToDelete}`, "DELETE");
            showToast("Task deleted successfully");
            closeModal();
            loadTasks();
        });
    }
});