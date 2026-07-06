"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BASE_URL = "http://localhost:5000/api/v1";
let adminToken = "";
let managerToken = "";
let employeeToken = "";
let createdProductId = "";
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
    console.log("\nProduct API Integration Tests\n");
    console.log("Auth Setup:");
    const unique = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const loginAdmin = async () => {
        await request("POST", "/auth/register", {
            name: "Admin User",
            email: `admin_${unique}@test.com`,
            password: "password123",
            role: "Admin",
        });
        const r = await request("POST", "/auth/login", {
            email: `admin_${unique}@test.com`,
            password: "password123",
        });
        return r.data.data?.token || "";
    };
    const loginManager = async () => {
        await request("POST", "/auth/register", {
            name: "Manager User",
            email: `manager_${unique}@test.com`,
            password: "password123",
            role: "Manager",
        });
        const r = await request("POST", "/auth/login", {
            email: `manager_${unique}@test.com`,
            password: "password123",
        });
        return r.data.data?.token || "";
    };
    const loginEmployee = async () => {
        await request("POST", "/auth/register", {
            name: "Employee User",
            email: `employee_${unique}@test.com`,
            password: "password123",
            role: "Employee",
        });
        const r = await request("POST", "/auth/login", {
            email: `employee_${unique}@test.com`,
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
    // --- Create Product (POST /products) ---
    console.log("\nPOST /products (Create Product):");
    const createAdmin = await request("POST", "/products", makeFormData("SKU-UNIQ-001", "Admin Product"), adminToken);
    assert("Admin can create product (201)", () => {
        if (createAdmin.status !== 201)
            throw new Error(`Expected 201, got ${createAdmin.status} - ${JSON.stringify(createAdmin.data)}`);
        if (createAdmin.data.data?.sku !== "SKU-UNIQ-001")
            throw new Error("SKU mismatch");
    });
    createdProductId = createAdmin.data.data?._id || "";
    const createManager = await request("POST", "/products", makeFormData("SKU-UNIQ-002", "Manager Product"), managerToken);
    assert("Manager can create product (201)", () => {
        if (createManager.status !== 201)
            throw new Error(`Expected 201, got ${createManager.status} - ${JSON.stringify(createManager.data)}`);
    });
    const employeeCreate = await request("POST", "/products", makeFormData("SKU-UNIQ-003", "Employee Product"), employeeToken);
    assert("Employee cannot create product (403)", () => {
        if (employeeCreate.status !== 403)
            throw new Error(`Expected 403, got ${employeeCreate.status}`);
    });
    const createNoImage = await request("POST", "/products", {
        name: "No Image Product",
        sku: "SKU-UNIQ-004",
        category: "Electronics",
        purchasePrice: 100,
        sellingPrice: 200,
        stockQuantity: 10,
    }, adminToken);
    assert("create without image returns 400", () => {
        if (createNoImage.status !== 400)
            throw new Error(`Expected 400, got ${createNoImage.status}`);
    });
    const createNoAuth = await request("POST", "/products", { name: "test" });
    assert("create without auth returns 401", () => {
        if (createNoAuth.status !== 401)
            throw new Error(`Expected 401, got ${createNoAuth.status}`);
    });
    if (!createdProductId) {
        console.log("\nCannot proceed with remaining tests - product creation failed.");
        return;
    }
    // --- GetAllProducts (GET /products) ---
    console.log("\nGET /products (Get All Products):");
    const getAllAdmin = await request("GET", "/products", undefined, adminToken);
    assert("Admin can get all products (200)", () => {
        if (getAllAdmin.status !== 200)
            throw new Error(`Expected 200, got ${getAllAdmin.status}`);
        if (!Array.isArray(getAllAdmin.data.data?.data))
            throw new Error("Expected array in data.data");
        if (!getAllAdmin.data.data?.meta)
            throw new Error("Expected meta in data.data");
    });
    const getAllWithQuery = await request("GET", "/products?name=Admin&page=1&limit=5&sortBy=sellingPrice&sortOrder=desc", undefined, adminToken);
    assert("Pagination and search query works", () => {
        if (getAllWithQuery.status !== 200)
            throw new Error(`Expected 200, got ${getAllWithQuery.status}`);
        if (!getAllWithQuery.data.data?.meta?.page)
            throw new Error("Expected meta.page");
        if (!getAllWithQuery.data.data?.meta?.limit)
            throw new Error("Expected meta.limit");
    });
    const getEmployeeList = await request("GET", "/products", undefined, employeeToken);
    assert("Employee can get all products (200)", () => {
        if (getEmployeeList.status !== 200)
            throw new Error(`Expected 200, got ${getEmployeeList.status}`);
    });
    // --- GetSingleProduct (GET /products/:id) ---
    console.log("\nGET /products/:id (Get Single Product):");
    const getSingleAdmin = await request("GET", `/products/${createdProductId}`, undefined, adminToken);
    assert("get single product (200)", () => {
        if (getSingleAdmin.status !== 200)
            throw new Error(`Expected 200, got ${getSingleAdmin.status} - ${JSON.stringify(getSingleAdmin.data)}`);
        if (!getSingleAdmin.data.data?.name)
            throw new Error("Expected product data");
    });
    const getInvalidId = await request("GET", "/products/invalidid123", undefined, adminToken);
    assert("get single product with invalid ID returns 404", () => {
        if (getInvalidId.status !== 404)
            throw new Error(`Expected 404, got ${getInvalidId.status}`);
    });
    const getEmployeeSingle = await request("GET", `/products/${createdProductId}`, undefined, employeeToken);
    assert("Employee can get single product by ID (200)", () => {
        if (getEmployeeSingle.status !== 200)
            throw new Error(`Expected 200, got ${getEmployeeSingle.status}`);
    });
    // --- UpdateProduct (PATCH /products/:id) ---
    console.log("\nPATCH /products/:id (Update Product):");
    const updateAdmin = await request("PATCH", `/products/${createdProductId}`, makeFormData("SKU-UNIQ-001-UPD", "Updated Laptop Name"), adminToken);
    assert("Admin can update product with new image (200)", () => {
        if (updateAdmin.status !== 200)
            throw new Error(`Expected 200, got ${updateAdmin.status} - ${JSON.stringify(updateAdmin.data)}`);
        if (updateAdmin.data.data?.name !== "Updated Laptop Name")
            throw new Error("Name not updated");
    });
    const updateBodyOnly = await request("PATCH", `/products/${createdProductId}`, {
        name: "Laptop Updated Again",
        sellingPrice: 1700,
    }, adminToken);
    assert("Admin can update product without new image", () => {
        if (updateBodyOnly.status !== 200)
            throw new Error(`Expected 200, got ${updateBodyOnly.status}`);
        if (updateBodyOnly.data.data?.sellingPrice !== 1700)
            throw new Error("Price not updated");
    });
    const managerUpdate = await request("PATCH", `/products/${createdProductId}`, { name: "Manager Update" }, managerToken);
    assert("Manager can update product (200)", () => {
        if (managerUpdate.status !== 200)
            throw new Error(`Expected 200, got ${managerUpdate.status}`);
    });
    const employeeUpdate = await request("PATCH", `/products/${createdProductId}`, { name: "Hack" }, employeeToken);
    assert("Employee cannot update product (403)", () => {
        if (employeeUpdate.status !== 403)
            throw new Error(`Expected 403, got ${employeeUpdate.status}`);
    });
    const updateInvalidId = await request("PATCH", "/products/invalidid999", { name: "Test" }, adminToken);
    assert("update with invalid ID returns 404", () => {
        if (updateInvalidId.status !== 404)
            throw new Error(`Expected 404, got ${updateInvalidId.status}`);
    });
    // --- DeleteProduct (DELETE /products/:id) ---
    console.log("\nDELETE /products/:id (Delete Product):");
    const deleteAdmin = await request("DELETE", `/products/${createdProductId}`, undefined, adminToken);
    assert("Admin can soft delete product (200)", () => {
        if (deleteAdmin.status !== 200)
            throw new Error(`Expected 200, got ${deleteAdmin.status} - ${JSON.stringify(deleteAdmin.data)}`);
        if (deleteAdmin.data.data?.isDeleted !== true)
            throw new Error("Expected isDeleted true");
    });
    const managerDelete = await request("DELETE", `/products/${createdProductId}`, undefined, managerToken);
    assert("Manager cannot delete product (403)", () => {
        if (managerDelete.status !== 403)
            throw new Error(`Expected 403, got ${managerDelete.status}`);
    });
    const employeeDelete = await request("DELETE", `/products/${createdProductId}`, undefined, employeeToken);
    assert("Employee cannot delete product (403)", () => {
        if (employeeDelete.status !== 403)
            throw new Error(`Expected 403, got ${employeeDelete.status}`);
    });
    const deleteInvalidId = await request("DELETE", "/products/nonexistentid", undefined, adminToken);
    assert("delete with invalid ID returns 404", () => {
        if (deleteInvalidId.status !== 404)
            throw new Error(`Expected 404, got ${deleteInvalidId.status}`);
    });
    // --- Verify soft delete in getAll ---
    console.log("\nGET /products (Verify soft delete filter):");
    const allAfterDelete = await request("GET", "/products?page=1&limit=100", undefined, adminToken);
    assert("soft deleted product is not visible", () => {
        if (!Array.isArray(allAfterDelete.data.data?.data))
            throw new Error("Expected array in data.data");
        const found = allAfterDelete.data.data.data.find((p) => p._id === createdProductId);
        if (found)
            throw new Error("Soft deleted product still visible");
    });
    console.log(`\nAll tests completed.\n`);
};
run();
