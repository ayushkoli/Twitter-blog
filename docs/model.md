# 📦 Step 1: Project Setup — Complete Guide

---

## 🧠 What is this step about?

Before writing a single line of business logic, every backend project needs a **solid foundation**. This step covers:

- Initializing the Node.js project
- Understanding and choosing the right dependencies
- Setting up the folder structure and why it's designed that way
- Configuring environment variables
- Setting up code formatting tools

This isn't just setup — the decisions made here affect **scalability, maintainability, and team collaboration** for the entire project.

---

## 1. Initializing the Project

```bash
mkdir backend
cd backend
npm init -y
```

`npm init -y` creates a `package.json` with default values. This file is the **identity card** of your Node.js project — it tracks your project name, version, scripts, and all dependencies.

### Key decision — `"type": "module"`

In your `package.json` you have:

```json
"type": "module"
```

This tells Node.js to treat all `.js` files as **ES Modules**, meaning you use:

```js
import express from 'express'   // ✅ ES Module syntax
// instead of
const express = require('express')  // ❌ CommonJS syntax
```

**Why choose ES Modules?**
- It's the modern JavaScript standard
- Works consistently across frontend and backend
- Better static analysis and tree-shaking support
- The direction the entire JS ecosystem is moving

> ⚠️ **Important:** Once you set `"type": "module"`, every import in your project must use ES Module syntax. Mixing `require()` and `import` will throw errors.

---

## 2. Understanding `package.json` — Dependency by Dependency

```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "license": "ISC",
  "author": "Ayush Koli",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "nodemon src/index.js"
  }
}
```

### `scripts` — What they do

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `nodemon src/index.js` | Run during development — auto-restarts on file changes |
| `start` | `nodemon src/index.js` | Same here, but in production you'd swap this for `node src/index.js` |

> 💡 **Tip for other projects:** In production, never use `nodemon`. Use `node src/index.js` directly or a process manager like `pm2`.

---

### Dependencies — Deep Explanation

#### `express` — Web Framework
```bash
npm install express
```
Express is a minimal web framework for Node.js. It gives you:
- Routing (`GET`, `POST`, `PUT`, `DELETE`)
- Middleware support
- Request/Response handling

Without Express you'd have to use Node's raw `http` module which is very verbose. Express is the industry standard — nearly every Node.js backend uses it.

You're using **Express v5** (`^5.2.1`) which has async error handling improvements over v4.

---

#### `mongoose` — MongoDB ODM
```bash
npm install mongoose
```
Mongoose is an **Object Document Mapper (ODM)** for MongoDB. It lets you:
- Define **Schemas** (structure for your data)
- Create **Models** (classes that interact with the DB)
- Add validations, hooks, and methods to your data

Without Mongoose you'd write raw MongoDB queries which have no structure or validation.

---

#### `dotenv` — Environment Variables
```bash
npm install dotenv
```
Loads variables from a `.env` file into `process.env`. This is critical because:
- You never hardcode secrets (DB passwords, API keys, JWT secrets) in code
- Different environments (dev, staging, production) can have different values
- Your `.env` file is in `.gitignore` so secrets never reach GitHub

---

#### `bcrypt` — Password Hashing
```bash
npm install bcrypt
```
Bcrypt is used to **hash passwords** before storing them in the database.

**Why hash passwords?**
- If your database is ever leaked, plain text passwords expose all users
- Bcrypt is a one-way hash — you can't reverse it back to the original password
- It adds a random **salt** automatically, so two identical passwords produce different hashes

```js
// What gets stored in DB (not the real password)
"$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
```

---

#### `jsonwebtoken` — JWT Authentication
```bash
npm install jsonwebtoken
```
JSON Web Tokens (JWT) are used for **stateless authentication**. After a user logs in:
1. Server creates a token containing the user's ID
2. Token is signed with a secret key
3. Client stores the token and sends it with every request
4. Server verifies the token — no need to query the DB on every request

**Why stateless?** You don't need to store session data on the server. This makes your API scalable across multiple servers.

---

#### `cors` — Cross-Origin Resource Sharing
```bash
npm install cors
```
By default, browsers block requests from one domain to another (e.g., your React frontend on `localhost:5173` calling your API on `localhost:3000`). CORS middleware tells the browser: *"Yes, this domain is allowed to talk to my server."*

Your `.env` has:
```
CORS_ORIGIN=*
```
The `*` means all origins are allowed — fine for development, but in production you should restrict this to your actual frontend URL.

---

#### `cookie-parser` — Reading Cookies
```bash
npm install cookie-parser
```
Parses cookies from incoming HTTP requests and makes them available via `req.cookies`. This is needed when you store JWT tokens in HTTP-only cookies (more secure than storing in `localStorage` on the frontend).

---

#### `multer` — File Upload Handling
```bash
npm install multer
```
Multer is middleware for handling `multipart/form-data`, which is the format used when uploading files. It processes the file and temporarily saves it to disk (in your `public/temp` folder) before you upload it to Cloudinary.

---

#### `cloudinary` — Cloud Image Storage
```bash
npm install cloudinary
```
Cloudinary is a cloud service for storing, transforming, and serving images/videos. The flow in your project:
1. User uploads a file → Multer saves it to `public/temp`
2. Your code reads from `public/temp` → uploads to Cloudinary
3. Cloudinary returns a URL → you store that URL in MongoDB
4. You delete the temp file from `public/temp`

---

#### `prettier` — Code Formatter
```bash
npm install prettier
```
Prettier automatically formats your code to a consistent style. This isn't a runtime dependency — it just makes your code readable and consistent, especially important when working in teams.

---

#### `nodemon` (devDependency) — Auto Restart
```bash
npm install --save-dev nodemon
```
Watches your files and automatically restarts the Node server when you save changes. Notice it's in `devDependencies` — it's only needed during development, not in production.

---

## 3. Folder Structure — Every Folder Explained

```
backend/
├── src/
│   ├── controllers/        → Business logic for each route
│   ├── models/             → Mongoose schemas and DB models
│   ├── routes/             → Route definitions, connect URL to controller
│   ├── middlewares/        → Functions that run before controllers
│   ├── utils/              → Reusable helper functions/classes
│   │   ├── ApiErrors.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   └── cloudinary.js
│   ├── db/                 → Database connection logic
│   ├── app.js              → Express app setup (middleware, routes)
│   ├── constants.js        → App-wide constant values
│   └── index.js            → Entry point, starts server
├── public/
│   └── temp/               → Temporary file storage for uploads
│       └── .gitkeep        → Keeps empty folder tracked by Git
├── .env                    → Environment variables (never commit this)
├── .gitignore              → Files Git should ignore
├── .prettierrc             → Prettier formatting config
├── .prettierignore         → Files Prettier should ignore
└── package.json            → Project metadata and dependencies
```

### Why this structure?

This follows the **MVC (Model-View-Controller)** pattern adapted for REST APIs:

| Folder | Responsibility | Why separate? |
|--------|---------------|---------------|
| `controllers/` | Handle request, call DB, send response | Keeps route files clean |
| `models/` | Define data shape and DB logic | Data logic isolated |
| `routes/` | Map URLs to controller functions | Easy to see all endpoints |
| `middlewares/` | Auth checks, validation before controllers | Reusable across routes |
| `utils/` | Shared helpers used everywhere | DRY principle — Don't Repeat Yourself |
| `db/` | Only DB connection code | Separation of concerns |

> 💡 **Why does this matter for other projects?** This same structure scales from a small project to a large enterprise app. Every professional Node.js codebase you encounter will follow some variation of this pattern.

---

## 4. Environment Variables — `.env` File

```env
PORT=3000
MONGODB_URL=mongodb://127.0.0.1:27017
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=koliayush
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=ayushkoli
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=dudut38y4
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Variable by Variable

| Variable | Purpose |
|----------|---------|
| `PORT` | Which port the server listens on |
| `MONGODB_URL` | MongoDB connection string — local here, Atlas URL in production |
| `CORS_ORIGIN` | Which frontend domains can call the API |
| `ACCESS_TOKEN_SECRET` | Secret key to sign JWT access tokens — should be a long random string in production |
| `ACCESS_TOKEN_EXPIRY` | How long access tokens are valid (`1d` = 1 day) |
| `REFRESH_TOKEN_SECRET` | Secret key to sign JWT refresh tokens |
| `REFRESH_TOKEN_EXPIRY` | How long refresh tokens are valid (`10d` = 10 days) |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary account identifier |
| `CLOUDINARY_API_KEY` | Cloudinary authentication key |
| `CLOUDINARY_API_SECRET` | Cloudinary authentication secret |

> ⚠️ **Security Rule:** The `.env` file must always be in `.gitignore`. Never commit it to GitHub. For production, set these variables directly in your hosting platform (Railway, Render, AWS, etc.)

> 💡 **Why two tokens (access + refresh)?** Access tokens expire quickly (1 day) for security. Refresh tokens last longer (10 days) and are used to silently get a new access token without making the user log in again. This is covered in detail in the Authentication step.

---

## 5. `public/temp/.gitkeep`

Git doesn't track empty folders. The `.gitkeep` file is an **empty placeholder file** whose only purpose is to make Git track the `public/temp/` directory so it exists when someone clones your repo.

Without this, Multer would crash trying to save files to a folder that doesn't exist.

---

## 6. Prettier — Code Formatting

Prettier enforces a consistent code style automatically. The `.prettierrc` file defines your formatting rules:

```json
{
  "singleQuote": false,
  "bracketSpacing": true
}
```

| Rule | Meaning |
|------|---------|
| `singleQuote: false` | Use double quotes `"` instead of single `'` |
| `bracketSpacing: true` | Spaces inside object brackets `{ key: value }` |

The `.prettierignore` file tells Prettier which files/folders to skip formatting (usually `node_modules`, build output, etc.)

---

## ✅ Summary — What You Set Up and Why

| What | Why it matters |
|------|---------------|
| ES Modules (`"type": "module"`) | Modern JS standard, cleaner imports |
| Separated `src/` folder | Keeps source code away from config files |
| MVC-style folder structure | Scalable, maintainable, industry standard |
| `.env` for secrets | Security — never hardcode credentials |
| `public/temp/` for uploads | Staging area before cloud upload |
| Prettier | Consistent code style across the project |
| `nodemon` as devDependency | Auto-restart in dev, not needed in production |

---

> 🚀 **Next Step:** [Step 2 — Database Connection](./database.md)