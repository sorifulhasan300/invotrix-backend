import { registerSchema, loginSchema } from "../src/validations/user.validation";

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

  console.log("\nZod Validation Tests\n");

  console.log("Register Schema:");
  assert("accepts valid payload", () => {
    const data = { name: "John Doe", email: "john@example.com", password: "password123" };
    registerSchema.parse(data);
  });

  assert("rejects short name", () => {
    try {
      registerSchema.parse({ name: "J", email: "john@example.com", password: "password123" });
      throw new Error("Should have failed");
    } catch (err: any) {
      if (!err.message.includes("Name must be at least 2 characters")) throw err;
    }
  });

  assert("rejects invalid email", () => {
    try {
      registerSchema.parse({ name: "John Doe", email: "invalid", password: "password123" });
      throw new Error("Should have failed");
    } catch (err: any) {
      if (!err.message.includes("Invalid email address")) throw err;
    }
  });

  assert("rejects short password", () => {
    try {
      registerSchema.parse({ name: "John Doe", email: "john@example.com", password: "123" });
      throw new Error("Should have failed");
    } catch (err: any) {
      if (!err.message.includes("Password must be at least 6 characters")) throw err;
    }
  });

  assert("defaults role to Employee", () => {
    const data = { name: "John Doe", email: "john@example.com", password: "password123" };
    const result = registerSchema.parse(data);
    if (result.role !== "Employee") throw new Error("Expected Employee");
  });

  assert("accepts Admin role", () => {
    const data = { name: "Admin", email: "admin@example.com", password: "password123", role: "Admin" };
    const result = registerSchema.parse(data);
    if (result.role !== "Admin") throw new Error("Expected Admin");
  });

  assert("rejects invalid role", () => {
    try {
      registerSchema.parse({ name: "Admin", email: "admin@example.com", password: "password123", role: "SuperAdmin" as any });
      throw new Error("Should have failed");
    } catch (err: any) {
      if (!err.message.includes("Invalid option")) throw err;
    }
  });

  console.log("\nLogin Schema:");
  assert("accepts valid payload", () => {
    loginSchema.parse({ email: "john@example.com", password: "password123" });
  });

  assert("rejects invalid email", () => {
    try {
      loginSchema.parse({ email: "invalid", password: "password123" });
      throw new Error("Should have failed");
    } catch (err: any) {
      if (!err.message.includes("Invalid email address")) throw err;
    }
  });

  assert("rejects empty password", () => {
    try {
      loginSchema.parse({ email: "john@example.com", password: "" });
      throw new Error("Should have failed");
    } catch (err: any) {
      if (!err.message.includes("Password is required")) throw err;
    }
  });

  console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
};

run();
