# Invotrix Backend

A Mini ERP API built with Express.js, MongoDB, and TypeScript.

## Features

- Authentication (JWT-based)
- Product management
- Sales management
- Dashboard analytics

## Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Required environment variables
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Development

```bash
npm run dev
```

## Build & Run

```bash
npm run build
npm start
```

## API Endpoints

Base URL: `/api/v1`

- `POST /auth` - Authentication routes
- `GET /products` - Product management
- `GET /sales` - Sales management
- `GET /dashboard` - Dashboard data