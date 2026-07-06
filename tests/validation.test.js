"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_validation_1 = require("../src/validations/user.validation");
const run = () => {
    let passed = 0;
    let failed = 0;
    const assert = (name, fn) => {
        try {
            fn();
            passed++;
            console.log(`  PASS: ${name}`);
        }
        catch (err) {
            failed++;
            console.log(`  FAIL: ${name} - ${err.message}`);
        }
    };
    console.log("\nZod Validation Tests\n");
    console.log("Register Schema:");
    assert("accepts valid payload", () => {
        const data = { name: "John Doe", email: "john@example.com", password: "password123" };
        user_validation_1.registerSchema.parse(data);
    });
    assert("rejects short name", () => {
        try {
            user_validation_1.registerSchema.parse({ name: "J", email: "john@example.com", password: "password123" });
            throw new Error("Should have failed");
        }
        catch (err) {
            if (!err.message.includes("Name must be at least 2 characters"))
                throw err;
        }
    });
    assert("rejects invalid email", () => {
        try {
            user_validation_1.registerSchema.parse({ name: "John Doe", email: "invalid", password: "password123" });
            throw new Error("Should have failed");
        }
        catch (err) {
            if (!err.message.includes("Invalid email address"))
                throw err;
        }
    });
    assert("rejects short password", () => {
        try {
            user_validation_1.registerSchema.parse({ name: "John Doe", email: "john@example.com", password: "123" });
            throw new Error("Should have failed");
        }
        catch (err) {
            if (!err.message.includes("Password must be at least 6 characters"))
                throw err;
        }
    });
    assert("defaults role to Employee", () => {
        const data = { name: "John Doe", email: "john@example.com", password: "password123" };
        const result = user_validation_1.registerSchema.parse(data);
        if (result.role !== "Employee")
            throw new Error("Expected Employee");
    });
    assert("accepts Admin role", () => {
        const data = { name: "Admin", email: "admin@example.com", password: "password123", role: "Admin" };
        const result = user_validation_1.registerSchema.parse(data);
        if (result.role !== "Admin")
            throw new Error("Expected Admin");
    });
    assert("rejects invalid role", () => {
        try {
            user_validation_1.registerSchema.parse({ name: "Admin", email: "admin@example.com", password: "password123", role: "SuperAdmin" });
            throw new Error("Should have failed");
        }
        catch (err) {
            if (!err.message.includes("Invalid option"))
                throw err;
        }
    });
    console.log("\nLogin Schema:");
    assert("accepts valid payload", () => {
        user_validation_1.loginSchema.parse({ email: "john@example.com", password: "password123" });
    });
    assert("rejects invalid email", () => {
        try {
            user_validation_1.loginSchema.parse({ email: "invalid", password: "password123" });
            throw new Error("Should have failed");
        }
        catch (err) {
            if (!err.message.includes("Invalid email address"))
                throw err;
        }
    });
    assert("rejects empty password", () => {
        try {
            user_validation_1.loginSchema.parse({ email: "john@example.com", password: "" });
            throw new Error("Should have failed");
        }
        catch (err) {
            if (!err.message.includes("Password is required"))
                throw err;
        }
    });
    console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
    process.exit(failed > 0 ? 1 : 0);
};
run();
