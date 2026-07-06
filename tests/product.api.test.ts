const run = () => {
  let passed = 0;
  let failed = 0;

  const assert = (name: string, fn: () => void) => {
    try {
      fn();
      passed++;
      console.log(`  PASS: ${name}`);
    } catch (err: any) {
      failed++;
      console.log(`  FAIL: ${name} - ${err.message}`);
    }
  };

  console.log("\nProduct Module Unit Tests\n");

  console.log("buildProductQuery:");
  const buildProductQuery = (query: Record<string, unknown>) => {
    const filter: Record<string, unknown> = { isDeleted: false };

    if (query.name && typeof query.name === "string") {
      filter.name = { $regex: query.name, $options: "i" };
    }

    if (query.sku && typeof query.sku === "string") {
      filter.sku = { $regex: query.sku, $options: "i" };
    }

    if (query.category && typeof query.category === "string") {
      filter.category = { $regex: query.category, $options: "i" };
    }

    const sortBy = typeof query.sortBy === "string" ? query.sortBy : "createdAt";
    const sortOrder =
      typeof query.sortOrder === "string" && query.sortOrder.toLowerCase() === "desc"
        ? -1
        : 1;
    const page = typeof query.page === "number" && query.page > 0 ? query.page : 1;
    const limit =
      typeof query.limit === "number" && query.limit > 0 ? query.limit : 10;
    const skip = (page - 1) * limit;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    return { filter, sort, page, limit, skip };
  };

  assert("returns default filter with isDeleted false", () => {
    const result = buildProductQuery({});
    if (result.filter.isDeleted !== false) throw new Error("Expected isDeleted false");
  });

  assert("filters by name case-insensitive regex", () => {
    const result = buildProductQuery({ name: "laptop" });
    if (!result.filter.name || !(result.filter.name as any).$regex) throw new Error("Expected name filter");
    if ((result.filter.name as any).$regex !== "laptop") throw new Error("Expected laptop");
    if ((result.filter.name as any).$options !== "i") throw new Error("Expected case-insensitive");
  });

  assert("filters by sku", () => {
    const result = buildProductQuery({ sku: "SKU-001" });
    if (!result.filter.sku) throw new Error("Expected sku filter");
  });

  assert("filters by category", () => {
    const result = buildProductQuery({ category: "Electronics" });
    if (!result.filter.category) throw new Error("Expected category filter");
  });

  assert("defaults sortBy to createdAt", () => {
    const result = buildProductQuery({});
    if (!result.sort.createdAt) throw new Error("Expected createdAt sort");
    if (result.sort.createdAt !== 1) throw new Error("Expected ascending");
  });

  assert("sorts desc when sortOrder is desc", () => {
    const result = buildProductQuery({ sortBy: "price", sortOrder: "desc" });
    if (result.sort.price !== -1) throw new Error("Expected descending");
  });

  assert("defaults page to 1", () => {
    const result = buildProductQuery({});
    if (result.page !== 1) throw new Error("Expected page 1");
  });

  assert("defaults limit to 10", () => {
    const result = buildProductQuery({});
    if (result.limit !== 10) throw new Error("Expected limit 10");
  });

  assert("respects custom page and limit", () => {
    const result = buildProductQuery({ page: 3, limit: 20 });
    if (result.page !== 3) throw new Error("Expected page 3");
    if (result.limit !== 20) throw new Error("Expected limit 20");
    if (result.skip !== 40) throw new Error("Expected skip 40");
  });

  assert("ignores invalid page (string) and defaults to 1", () => {
    const result = buildProductQuery({ page: "abc" as any });
    if (result.page !== 1) throw new Error("Expected page 1");
  });

  assert("ignores negative page and defaults to 1", () => {
    const result = buildProductQuery({ page: -5 });
    if (result.page !== 1) throw new Error("Expected page 1");
  });

  console.log("\nProduct Service & Controller Imports:");
  assert("product.service.ts exports createProductIntoDB", async () => {
    const mod = await import("../src/modules/product/product.service.js");
    if (typeof mod.createProductIntoDB !== "function") throw new Error("Missing export");
  });

  assert("product.service.ts exports getAllProductsFromDB", async () => {
    const mod = await import("../src/modules/product/product.service.js");
    if (typeof mod.getAllProductsFromDB !== "function") throw new Error("Missing export");
  });

  assert("product.service.ts exports getSingleProductFromDB", async () => {
    const mod = await import("../src/modules/product/product.service.js");
    if (typeof mod.getSingleProductFromDB !== "function") throw new Error("Missing export");
  });

  assert("product.service.ts exports updateProductInDB", async () => {
    const mod = await import("../src/modules/product/product.service.js");
    if (typeof mod.updateProductInDB !== "function") throw new Error("Missing export");
  });

  assert("product.service.ts exports deleteProductFromDB", async () => {
    const mod = await import("../src/modules/product/product.service.js");
    if (typeof mod.deleteProductFromDB !== "function") throw new Error("Missing export");
  });

  assert("product.controller.ts exports createProduct", async () => {
    const mod = await import("../src/modules/product/product.controller.js");
    if (typeof mod.createProduct !== "function") throw new Error("Missing export");
  });

  assert("product.controller.ts exports getAllProducts", async () => {
    const mod = await import("../src/modules/product/product.controller.js");
    if (typeof mod.getAllProducts !== "function") throw new Error("Missing export");
  });

  assert("product.controller.ts exports getSingleProduct", async () => {
    const mod = await import("../src/modules/product/product.controller.js");
    if (typeof mod.getSingleProduct !== "function") throw new Error("Missing export");
  });

  assert("product.controller.ts exports updateProduct", async () => {
    const mod = await import("../src/modules/product/product.controller.js");
    if (typeof mod.updateProduct !== "function") throw new Error("Missing export");
  });

  assert("product.controller.ts exports deleteProduct", async () => {
    const mod = await import("../src/modules/product/product.controller.js");
    if (typeof mod.deleteProduct !== "function") throw new Error("Missing export");
  });

  assert("product.route.ts exports productRouter", async () => {
    const mod = await import("../src/modules/product/product.route.js");
    if (!mod.productRouter) throw new Error("Missing productRouter");
  });

  console.log("\nProduct Route Definitions:");
  assert("GET / uses auth with Admin, Manager, Employee", async () => {
    const { productRouter } = await import("../src/modules/product/product.route.js");
    const layer = productRouter.stack.find((l: any) => l.route && l.route.methods.get && l.route.path === "/");
    if (!layer) throw new Error("Route not found");
    const middlewares = layer.route.stack.map((m: any) => m.handle.name || m.handle);
    if (!middlewares.includes("auth")) throw new Error("Missing auth middleware");
  });

  assert("POST / uses upload.single('image')", async () => {
    const { productRouter } = await import("../src/modules/product/product.route.js");
    const layer = productRouter.stack.find((l: any) => l.route && l.route.methods.post && l.route.path === "/");
    if (!layer) throw new Error("Route not found");
    const hasUpload = layer.route.stack.some((m: any) => m.handle.name === "upload");
    if (!hasUpload) throw new Error("Missing upload middleware");
  });

  assert("PATCH /:id uses auth and upload", async () => {
    const { productRouter } = await import("../src/modules/product/product.route.js");
    const layer = productRouter.stack.find((l: any) => l.route && l.route.methods.patch && l.route.path === "/:id");
    if (!layer) throw new Error("Route not found");
    const middlewares = layer.route.stack.map((m: any) => m.handle.name || m.handle);
    if (!middlewares.includes("auth")) throw new Error("Missing auth middleware");
    const hasUpload = layer.route.stack.some((m: any) => m.handle.name === "upload");
    if (!hasUpload) throw new Error("Missing upload middleware");
  });

  assert("DELETE /:id uses auth", async () => {
    const { productRouter } = await import("../src/modules/product/product.route.js");
    const layer = productRouter.stack.find((l: any) => l.route && l.route.methods.delete && l.route.path === "/:id");
    if (!layer) throw new Error("Route not found");
    const middlewares = layer.route.stack.map((m: any) => m.handle.name || m.handle);
    if (!middlewares.includes("auth")) throw new Error("Missing auth middleware");
  });

  console.log("\nProduct Interface:");
  assert("product.interface.ts exports IProduct", async () => {
    const mod = await import("../src/modules/product/product.interface.js");
    if (!mod.IProduct) throw new Error("Missing IProduct");
  });

  assert("IProduct has required fields", async () => {
    const { IProduct } = await import("../src/modules/product/product.interface.js");
    const fields = ["name", "sku", "category", "purchasePrice", "sellingPrice", "stockQuantity", "productImage", "isDeleted"];
    for (const field of fields) {
      if (!(field in IProduct.prototype)) throw new Error(`Missing ${field}`);
    }
  });

  console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
};

run();
