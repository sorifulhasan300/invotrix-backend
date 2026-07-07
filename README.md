# Invotrix ERP Backend

A high-performance API for inventory, sales operations, and employee management. Built with Express.js, MongoDB, and TypeScript.

---

## 🚀 Minimalistic Overview

Invotrix ERP provides role-based API modules for business operations:
- **Admin**: Full dashboard analysis, product control, and administrative settings.
- **Manager**: Inventory replenishment, sales history, and operations reporting.
- **Employee**: Dedicated endpoints for transaction entries and receipt generation.

---

## 🛠️ Tech Stack

- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Language**: TypeScript
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer + Cloudinary
- **Validation**: Zod

---

## 💻 Project Setup & Installation

### 1. Prerequisites
Ensure you have the following installed on your system:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Clone the Repository
```bash
git clone https://github.com/sorifulhasan300/invotrix-backend.git
cd invotrix-backend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory and specify the required variables:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 5. Running the Development Server
Start the local server with hot-reload enabled:
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

### 6. Building for Production
To bundle and optimize the project for deployment:
```bash
npm run build
npm start
```

---

## 📁 Key Directory Structure

```text
src/
├── app.ts                  # Express application setup
├── server.ts               # Server entry point
├── config/                 # Configuration (env, cloudinary)
├── modules/                # Feature modules (auth, product, sales, dashboard)
├── models/                 # Mongoose models
├── router/                 # Main router
├── middlewares/            # Custom middlewares
├── utils/                 # Utility functions and helpers
└── types/                 # TypeScript type definitions
```

---

## 📡 API Endpoints

Base URL: `/api/v1`

| Endpoint | Description |
|----------|-------------|
| `POST /auth` | Authentication routes (login, register) |
| `GET /products` | Product CRUD operations |
| `GET /sales` | Sales management and history |
| `GET /dashboard` | Analytics and dashboard data |