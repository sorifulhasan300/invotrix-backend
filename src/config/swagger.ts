import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";
import { envVars } from "./env.config";

const port = envVars.PORT || 5000;

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Invotrix ERP API Documentation",
      version: "1.0.0",
      description: "API Documentation for the Invotrix ERP backend services.",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Development Server",
      },
      {
        url: `https://invotrix-backend.onrender.com`,
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token in the format: <token>",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64a7c85e2b0e9f1a23456789" },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            role: { type: "string", enum: ["Admin", "Manager", "Employee"], example: "Employee" },
            profileImage: { type: "string", example: "https://cloudinary.com/.../profile.jpg" },
            isDeleted: { type: "boolean", example: false },
            createdAt: { type: "string", format: "date-time", example: "2026-07-07T12:00:00.000Z" },
            updatedAt: { type: "string", format: "date-time", example: "2026-07-07T12:00:00.000Z" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "An error occurred" },
          },
        },
        Product: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64b8c95e2b0e9f1a23456780" },
            name: { type: "string", example: "Wireless Mouse" },
            sku: { type: "string", example: "MS-WRL-01" },
            category: { type: "string", example: "Electronics" },
            purchasePrice: { type: "number", example: 10.50 },
            sellingPrice: { type: "number", example: 15.00 },
            stockQuantity: { type: "integer", example: 100 },
            productImages: { type: "array", items: { type: "string" }, example: ["https://cloudinary.com/.../img1.jpg"] },
            isDeleted: { type: "boolean", example: false },
            createdAt: { type: "string", format: "date-time", example: "2026-07-07T12:00:00.000Z" },
            updatedAt: { type: "string", format: "date-time", example: "2026-07-07T12:00:00.000Z" },
          },
        },
        ProductDropdownItem: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64b8c95e2b0e9f1a23456780" },
            name: { type: "string", example: "Wireless Mouse" },
            sku: { type: "string", example: "MS-WRL-01" },
            sellingPrice: { type: "number", example: 15.00 },
            stockQuantity: { type: "integer", example: 100 },
          },
        },
        Sale: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64b8c95e2b0e9f1a23456799" },
            grandTotal: { type: "number", example: 45.00 },
            createdBy: { type: "string", example: "64a7c85e2b0e9f1a23456789" },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  product: {
                    oneOf: [
                      { type: "string", example: "64b8c95e2b0e9f1a23456780" },
                      { $ref: "#/components/schemas/Product" }
                    ]
                  },
                  quantity: { type: "integer", example: 3 },
                  pricePerUnit: { type: "number", example: 15.00 },
                },
              },
            },
            createdAt: { type: "string", format: "date-time", example: "2026-07-07T12:00:00.000Z" },
            updatedAt: { type: "string", format: "date-time", example: "2026-07-07T12:00:00.000Z" },
          },
        },
      },
    },
  },
  apis: ["./src/docs/**/*.yaml"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Application): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
