async function register() {
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    const messageEl = document.getElementById("reg-message");

    messageEl.className = "message"; 
    messageEl.textContent = "";

    try {
        await apiRequest("/auth/register", "POST", {
            email,
            password
        });

        messageEl.textContent = "Registration successful! Login to your account...";
        messageEl.classList.add("success", "show");

    } catch (error) {
        messageEl.textContent = error.message;
        messageEl.classList.add("error", "show");
    }
}

async function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const messageEl = document.getElementById("login-message");

    messageEl.className = "message";
    messageEl.textContent = "";

    try {
        const data = await apiRequest("/auth/login", "POST", {
            email,
            password
        });

        localStorage.setItem("access_token", data.access_token);
        window.location.href = "dashboard.html";

    } catch (error) {
        messageEl.textContent = error.message;
        messageEl.classList.add("error", "show");
    }
}