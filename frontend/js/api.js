const BASE_URL = "http://127.0.0.1:8000/api/v1";

async function apiRequest(endpoint, method = "GET", data = null) {
    const token = localStorage.getItem("access_token");

    const options = {
        method: method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (token) {
        options.headers["Authorization"] = `Bearer ${token}`;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        if (Array.isArray(result.detail)) {
            const messages = result.detail.map(err => err.msg);
            throw new Error(messages.join("\n"));  
        }

        throw new Error(result.detail || "Something went wrong");
    }

    return result;
}