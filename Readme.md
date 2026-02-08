# 🧠 MilanDSA Backend

This repository contains the **backend for the MilanDSA platform**, built using **Express.js and TypeScript**..

The purpose of this backend is to serve as a **robust API layer** that can later integrate authentication, databases, and other services while remaining easy to understand and extend for any developer.

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **Swagger (OpenAPI)** – API documentation
- **ts-node-dev** – Development server
- **Helmet** – Security headers
- **CORS** – Cross-origin support
- **Morgan** – Request logging
- **dotenv** – Environment configuration

---

## 🎯 Purpose of This Backend

The MilanDSA backend is designed to:

- Act as a **service-oriented API**
- Be **easy to scale and maintain**
- Keep responsibilities **clearly separated**
- Allow future integration with **Auth, Databases, and External Services**

This setup avoids a monolithic structure and instead follows **feature-based modular design**.

---

## 📁 Folder Structure Explained

```txt
backend/
│
├── src/
│   ├── config/            # Global configuration files
│   │   ├── env.ts         # Environment variable loader & validator
│   │   └── swagger.ts     # Swagger / OpenAPI configuration
│   │
│   ├── routes/            # All API routes (feature-based)
│   │   ├── health/
│   │   │   └── route.ts   # Health check endpoint
│   │   └── root/
│   │       └── route.ts   # Base GET route (server check)
│   │
│   ├── utils/
│   │   └── routeReg.ts    # Dynamic route registration utility
│   │
│   ├── middleware/        # Custom Express middleware (auth, validation, etc.)
│   ├── services/          # Business logic layer (future use)
│   ├── models/            # Database models / schemas (future use)
│   ├── controllers/       # Controllers if separating logic from routes
│   │
│   ├── app.ts             # Express app configuration
│   └── server.ts          # Server entry point
│
├── .env                   # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔌 Dynamic Route Registration

All routes follow this convention:

```txt
src/routes/<feature-name>/route.ts
```

Routes are **not manually imported** into the app.

Instead, a utility automatically discovers and mounts them.

📄 **File responsible:**

```txt
src/utils/routeReg.ts
```

### How it works

- Recursively scans the `routes` directory
- Finds every `route.ts` file
- Mounts each route using its folder name as the base path

### Example

```txt
src/routes/health/route.ts → /health
src/routes/root/route.ts   → /
```

This makes adding new APIs extremely simple and consistent.

---

## ❤️ Health Check Route

**Location:**

```txt
src/routes/health/route.ts
```

**Endpoint:**

```http
GET /health
```

**Purpose:**

- Confirms backend is running
- Used for monitoring and deployment checks

**Sample Response:**

```json
{
  "status": "ok",
  "service": "milanDSA-backend",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

---

## 🌐 Root Route (Server Check)

**Location:**

```txt
src/routes/root/route.ts
```

**Endpoint:**

```http
GET /
```

**Purpose:**

- Simple confirmation that the server is live
- Helps new developers instantly verify setup

**Sample Response:**

```json
{
  "message": "MilanDSA backend is running",
  "docs": "/docs"
}
```

---

## 📘 API Documentation (Swagger)

**Endpoint:**

```http
GET /docs
```

Swagger UI provides:

- List of all available endpoints
- Request/response schemas
- Easy testing interface

Configured via:

```txt
src/config/swagger.ts
```

Routes can be documented directly inside `route.ts` files using JSDoc comments.

---

## ⚙️ Environment Variables

📄 `.env`

```env
PORT=8080
NODE_ENV=development
```

Port **8080** is intentionally used so developers can immediately recognize the backend service.

---

## ▶️ Running the Backend

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Server will be available at:

```txt
http://localhost:8080
```

Swagger UI:

```txt
http://localhost:8080/docs
```

---

## 📌 Notes for Contributors

- Every new API **must live inside `src/routes/<feature>/route.ts`**
- Avoid placing routes in root files
- Business logic should move to `services/` as the project grows

---

**MilanDSA Backend** is structured to be clean, predictable, and easy to maintain for any developer joining the project.
