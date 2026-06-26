# AI Itinerary Travel Planner 🌍✈️

A modern, high-performance **MERN Stack** travel planner application that allows users to upload booking documents (PDFs/Images) and automatically generate structured, day-by-day itineraries and budget breakdowns using the **Groq Llama-3** model.

---

## 🚀 Key Features

*   **Smart Document Extraction**: Upload flight/train/hotel booking tickets as PDFs or Images. Text is extracted using `pdfjs-dist` (for PDFs) and `Tesseract.js` OCR (for images).
*   **AI-Powered Generation**: Itinerary plans and estimated budget breakdowns are automatically structured based on extracted ticket details.
*   **Simple & Clean UX**: Fully simplified day timeline checklists (Morning, Afternoon, Evening) and interactive budget cards.
*   **Shareable Itineraries**: Generate public, copy-to-clipboard links to share your custom itineraries.
*   **Responsive Design**: Premium dark mode design built with React, Tailwind CSS, and vanilla styling.

---

## 🛠️ Tech Stack

*   **Frontend**: React, Vite, Axios, TailwindCSS, Lucide-react / React-icons
*   **Backend**: Node.js, Express, Multer, `pdfjs-dist` (legacy ESM parser), `Tesseract.js` (OCR)
*   **Database**: MongoDB Atlas (Mongoose)
*   **AI Inference**: Groq Cloud SDK (`llama-3.3-70b-versatile`)

---

## 📂 Project Structure

```text
├── backend/                  # Express REST API
│   ├── config/               # DB connections
│   ├── controllers/          # Route controller logic
│   ├── middlewares/          # Auth & Multer upload middlewares
│   ├── models/               # MongoDB Mongoose models
│   ├── routes/               # Express endpoints
│   ├── services/             # AI prompting & PDF extraction engines
│   └── uploads/              # Temporary file storage (created dynamically)
├── frontend/                 # React SPA
│   └── Ai-travel/
│       ├── src/              # Components, pages, assets, and service wrappers
│       ├── dist/             # Production build static assets (after building)
│       └── package.json
├── package.json              # Root monorepo scripts for install, build & deploy
└── README.md                 # Deployment & setup documentation
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
Ensure you have **Node.js (v18+)** installed.

### 2. Backend Environment Variables
Create a file named `.env` inside the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_secret
GROQ_API_KEY=your_groq_api_token
```

### 3. Local Development Run
To run both backend and frontend locally in development mode:

1.  **Install dependencies**:
    ```bash
    npm run install-all
    ```
    *(This runs `npm install` inside both `backend` and `frontend/Ai-travel` directories).*

2.  **Start Backend server (Nodemon)**:
    ```bash
    cd backend
    npm run dev
    ```
    *(Runs on `http://localhost:5000`)*

3.  **Start Frontend server (Vite)**:
    ```bash
    cd frontend/Ai-travel
    npm run dev
    ```
    *(Runs on `http://localhost:5173`)*

---

## 🌐 Production Deployment

This project is pre-configured to be deployed as a **single unified service** (monorepo structure) or as **split services** (e.g. Frontend on Vercel, Backend on Render).

### Option A: Single Unified Deployment (Recommended for Render, Railway, VPS)
In this setup, your backend Express app serves the compiled static React build files when `NODE_ENV=production`.

#### 1. Setup on Render (Web Service)
*   **Repository Root**: Root of the project.
*   **Build Command**: `npm run render-postbuild`
    *(This installs all dependencies and compiles the React app into `frontend/Ai-travel/dist`).*
*   **Start Command**: `npm start`
    *(Starts the Express server from `backend/server.js`).*
*   **Environment Variables**:
    *   `NODE_ENV=production`
    *   `PORT=10000` (or leave default)
    *   `MONGO_URI=your_mongodb_connection_string`
    *   `JWT_SECRET=your_jwt_signing_secret`
    *   `GROQ_API_KEY=your_groq_api_token`

Your Express server will automatically handle API routing at `/api/*` and return the React frontend for all other client requests.

---

### Option B: Split Deployment (Frontend on Vercel/Netlify, Backend on Render)

If you prefer to host your frontend separately:

#### 1. Backend Setup
*   Deploy the `backend` folder as a Web Service.
*   Environment variables: `MONGO_URI`, `JWT_SECRET`, `GROQ_API_KEY`.

#### 2. Frontend Setup
*   Deploy the `frontend/Ai-travel` folder to Vercel/Netlify.
*   Add the following environment variable in your Vercel dashboard:
    *   `VITE_API_URL=https://your-backend-service-url.onrender.com/api`
*   Build Command: `npm run build`
*   Output Directory: `dist`

---

## 🧹 Codebase Status & Fixes
*   **PDF Parsing Bug Fix**: Replaced the outdated `pdf-parse` library with the high-performance `pdfjs-dist` (legacy ESM wrapper) to eliminate `bad XRef entry` crashes on programmatically generated PDF tickets.
*   **Robust Multer Storage**: The `uploads/` folder is now programmatically generated at runtime by Express if missing, eliminating directory-not-found errors during clean deployments.
*   **Production API URLs**: Integrated `import.meta.env.VITE_API_URL` to easily switch backend connection URLs without editing code files.
