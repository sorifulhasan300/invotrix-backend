"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BASE_URL = "http://localhost:5000/api/v1";
const request = async (method, path, body, token) => {
    const headers = {};
    if (token)
        headers["Authorization"] = `Bearer ${token}`;
    if (body && !(body instanceof FormData))
        headers["Content-Type"] = "application/json";
    const options = {
        method,
        headers,
    };
    if (body instanceof FormData) {
        options.body = body;
    }
    else if (body !== undefined && body !== null) {
        options.body = JSON.stringify(body);
    }
    const res = await fetch(`${BASE_URL}${path}`, options);
    const text = await res.text();
    console.log(`--- ${method} ${path} (${res.status}) ---`);
    console.log(text);
    console.log("");
};
const run = async () => {
    const loginRes = await request("POST", "/auth/login", { email: "admin@test.com", password: "password123" });
};
run();
