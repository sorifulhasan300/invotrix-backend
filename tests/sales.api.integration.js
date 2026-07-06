"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BASE_URL = "http://localhost:5000/api/v1";
let adminToken = "";
let managerToken = "";
let employeeToken = "";
let testProductId = "";
const request = async (method, path, body, token) => {
    const headers = {};
    if (token)
        headers["Authorization"] = `Bearer ${token}`;
    if (body && !(body instanceof FormData))
        headers["Content-Type"] = "application/json";
    const options = {
        method,
        headers,
        body: body instanceof FormData ? body : body !== undefined && body !== null ? JSON.stringify(body) : undefined,
    };
    const res = await fetch(`${BASE_URL}${path}`, options);
    const text = await res.text();
    try {
        const data = JSON.parse(text);
        return { status: res.status, data };
    }
    catch {
        return { status: res.status, data: text };
    }
};
const assert = (name, fn) => {
    try {
        fn();
        console.log(`  PASS: ${name}`);
    }
    catch (err) {
        console.log(`  FAIL: ${name} - ${err.message}`);
        process.exitCode = 1;
    }
};
const makeFormData = (sku, name, extra = {}) => {
    const validPng = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    const imageBuffer = Uint8Array.from(atob(validPng), c => c.charCodeAt(0));
    const blob = new Blob([imageBuffer], { type: "image/png" });
    const formData = new FormData();
    formData.append("name", name);
    formData.append("sku", sku);
    formData.append("category", extra.category || "Electronics");
    formData.append("purchasePrice", String(extra.purchasePrice ?? 1000));
    formData.append("sellingPrice", String(extra.sellingPrice ?? 1500));
    formData.append("stockQuantity", String(extra.stockQuantity ?? 50));
    formData.append("image", blob, "test.png");
    return formData;
};
const run = async () => {
    console.log("\nSales API Integration Tests\n");
    console.log("Auth Setup:");
    const unique = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 500));
    const loginAdmin = async () => {
        await request("POST", "/auth/register", {
            name: "Admin User",
            email: `sales_admin_${unique}@test.com`,
            password: "password123",
            role: "Admin",
        });
        const r = await request("POST", "/auth/login", {
            email: `sales_admin_${unique}@test.com`,
            password: "password123",
        });
        return r.data.data?.token || "";
    };
    const loginManager = async () => {
        await request("POST", "/auth/register", {
            name: "Manager User",
            email: `sales_manager_${unique}@test.com`,
            password: "password123",
            role: "Manager",
        });
        const r = await request("POST", "/auth/login", {
            email: `sales_manager_${unique}@test.com`,
            password: "password123",
        });
        return r.data.data?.token || "";
    };
    const loginEmployee = async () => {
        await request("POST", "/auth/register", {
            name: "Employee User",
            email: `sales_employee_${unique}@test.com`,
            password: "password123",
            role: "Employee",
        });
        const r = await request("POST", "/auth/login", {
            email: `sales_employee_${unique}@test.com`,
            password: "password123",
        });
        return r.data.data?.token || "";
    };
    adminToken = await loginAdmin();
    assert("login as Admin returns token", () => {
        if (!adminToken)
            throw new Error("No admin token");
    });
    managerToken = await loginManager();
    assert("login as Manager returns token", () => {
        if (!managerToken)
            throw new Error("No manager token");
    });
    employeeToken = await loginEmployee();
    assert("login as Employee returns token", () => {
        if (!employeeToken)
            throw new Error("No employee token");
    });
    // --- Create Product for Sale ---
    console.log("\nProduct Setup:");
    testProductId = "6a4ba0a8d52f5bf280566753";
    const product2Id = "6a4ba420ffdc355d4bc17faa";
    // --- POST /sales (Create Sale) ---
    console.log("\nPOST /sales (Create Sale):");
    const salePayload = (productId, quantity, sellingPrice) => ({
        items: [{ product: productId, quantity, sellingPrice }],
    });
    const createAdminSale = await request("POST", "/sales", salePayload(testProductId, 2, 500), adminToken);
    assert("Admin can create sale (201)", () => {
        if (createAdminSale.status !== 201)
            throw new Error(`Expected 201, got ${createAdminSale.status} - ${JSON.stringify(createAdminSale.data)}`);
        if (!createAdminSale.data.data?.grandTotal)
            throw new Error("Missing grandTotal");
    });
    const createManagerSale = await request("POST", "/sales", salePayload(testProductId, 1, 600), managerToken);
    assert("Manager can create sale (201)", () => {
        if (createManagerSale.status !== 201)
            throw new Error(`Expected 201, got ${createManagerSale.status} - ${JSON.stringify(createManagerSale.data)}`);
    });
    const createEmployeeSale = await request("POST", "/sales", salePayload(testProductId, 1, 500), employeeToken);
    assert("Employee can create sale (201)", () => {
        if (createEmployeeSale.status !== 201)
            throw new Error(`Expected 201, got ${createEmployeeSale.status} - ${JSON.stringify(createEmployeeSale.data)}`);
    });
    const createNoAuth = await request("POST", "/sales", salePayload(testProductId, 1, 500));
    assert("create sale without auth returns 401", () => {
        if (createNoAuth.status !== 401)
            throw new Error(`Expected 401, got ${createNoAuth.status}`);
    });
    const createMissingProducts = await request("POST", "/sales", {}, adminToken);
    assert("create sale with missing items returns 400/500", () => {
        if (createMissingProducts.status < 400)
            throw new Error(`Expected error status, got ${createMissingProducts.status}`);
    });
    const createInvalidProductId = await request("POST", "/sales", { items: [{ product: "invalidid", quantity: 1, sellingPrice: 100 }] }, adminToken);
    assert("create sale with invalid product id returns 404", () => {
        if (createInvalidProductId.status !== 404)
            throw new Error(`Expected 404, got ${createInvalidProductId.status}`);
    });
    const createEmptyProducts = await request("POST", "/sales", { items: [] }, adminToken);
    assert("create sale with empty items returns error", () => {
        if (createEmptyProducts.status < 400)
            throw new Error(`Expected error status, got ${createEmptyProducts.status}`);
    });
    // --- Stock Verification ---
    console.log("\nStock Verification:");
    const verifiedProductId = "6a4ba420ffdc355d4bc17faa";
    const productBefore = await request("GET", `/products/${verifiedProductId}`, undefined, adminToken);
    assert("verified product exists before sale", () => {
        if (productBefore.status !== 200)
            throw new Error(`Expected 200, got ${productBefore.status}`);
    });
    const initialStock = productBefore.data.data?.stockQuantity;
    const helperSale = await request("POST", "/sales", { items: [{ product: verifiedProductId, quantity: 1, sellingPrice: 100 }] }, adminToken);
    assert("helper sale for stock verification (201)", () => {
        if (helperSale.status !== 201)
            throw new Error(`Expected 201, got ${helperSale.status}`);
    });
    const productAfter = await request("GET", `/products/${verifiedProductId}`, undefined, adminToken);
    assert("stock decreased by sale quantity", () => {
        if (productAfter.status !== 200)
            throw new Error(`Expected 200, got ${productAfter.status}`);
        const remaining = productAfter.data.data?.stockQuantity;
        if (remaining !== (initialStock - 1))
            throw new Error(`Expected stock ${initialStock - 1}, got ${remaining}`);
    });
    // --- Multiple Products Sale ---
    console.log("\nPOST /sales (Multiple Products):");
    const multiSale = await request("POST", "/sales", {
        items: [
            { product: testProductId, quantity: 3, sellingPrice: 400 },
            { product: product2Id, quantity: 2, sellingPrice: 300 },
        ],
    }, adminToken);
    assert("Admin can create sale with multiple items (201)", () => {
        if (multiSale.status !== 201)
            throw new Error(`Expected 201, got ${multiSale.status} - ${JSON.stringify(multiSale.data)}`);
        const expectedTotal = 3 * 400 + 2 * 300;
        if (multiSale.data.data?.grandTotal !== expectedTotal)
            throw new Error(`Expected grandTotal ${expectedTotal}, got ${multiSale.data.data?.grandTotal}`);
    });
    console.log("\nAll tests completed.\n");
};
run();
