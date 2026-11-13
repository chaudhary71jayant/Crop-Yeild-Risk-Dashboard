# Crop Yield Risk & Advisory Dashboard

A full-stack agricultural decision-support dashboard that visualises calculated crop yield risk scores, underlying environmental and economic risk drivers, multi-year historical trajectories, and multi-district comparative analytics across Northern India.

---

## 1. Project Overview & Coverage

- **Coverage:** 3 States (Haryana, Punjab, Uttar Pradesh), 120 agricultural districts, 3 staple crops (Rice, Wheat, Maize), across 4 crop-years (`2021-22` through `2024-25`).
- **Data Grain:** Exactly one record per `state + district + crop + year` (1,403 total rows in database).
- **Core Functionality:**
  - Dynamic filtering by state, crop, and crop-year.
  - Drill-down district view with historical multi-year records, key performance indicators, top driver breakdowns, and visual trend charts.
  - Side-by-side comparative analysis of 2–4 districts with comparative bar charting.
  - Transparent data quality indicators and explainable risk model documentation.

---

## 2. Who Built What

| Role / Collaborator | Responsibilities & Deliverables |
|---|---|
| **Backend / Project Owner**<br>*(Jayant Chaudhary)* | • Initial Node/Express REST API architecture (ES modules, arrow function style, central error handling, winston/morgan logging).<br>• Prisma 7 database schema (`district_data` & `risk_scores`), initial migrations, and Supabase PostgreSQL setup.<br>• REST endpoints (`/health`, `/districts`, `/district/:id`, `/filters`, `/compare`).<br>• Initial React + Vite + TypeScript frontend scaffolding and baseline list/detail pages. |
| **Data Analyst Teammate**<br>*(Data Pipeline)* | • Analytical model design (`docs/risk_model_config.json`) for agricultural yield risk scoring.<br>• Historical data processing, anomaly scoring, and CSV generation (`data/backend_handoff_2021_2025.csv`).<br>• Confirmation of metric definitions and units: `area_hectares` (ha), `production_tonnes` (tonnes), `yield_kg_per_hectare` (kg/ha), `rainfall_mm` (mm). |
| **Full-Stack Handoff Engineer**<br>*(Current Phase)* | • **Trend Chart Bug Fix:** Resolved blank chart rendering via Tailwind v4 entry configuration and explicit pixel-height containment for Recharts `ResponsiveContainer`.<br>• **Compare View:** Designed and built `/compare` feature with multi-district selection, side-by-side metric comparison table, URL synchronization, and comparative bar chart.<br>• **Confirmed Units:** Integrated confirmed units for cultivated area (`ha`) and production (`tonnes`) across detail and compare views.<br>• **UI/UX Polish:** Added color-coded risk badges (Low, Medium, High, Unscored), data quality badges with explanatory tooltips, an interactive "How the Score Works" card, fully clickable table rows, and responsive layouts.<br>• **Backend Hardening:** Added stable multi-column sorting, input validation/capping for pagination, 5xx error sanitization, dynamic production CORS via `FRONTEND_URL`, and made data importing idempotent with upsert.<br>• **Deployment & Docs:** Configured SPA rewrites for Vercel/Netlify, deployment automation scripts, and this handoff guide. |

---

## 3. Tech Stack

- **Backend:** Node.js (v18+), Express (v5), Prisma ORM 7 (`@prisma/client`, `@prisma/adapter-pg`), PostgreSQL on Supabase, Winston logger, Morgan HTTP logger.
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4 (`@tailwindcss/vite`), Recharts 3.x, React Router 7.
- **Architecture Highlights:**
  - ES Modules (`"type": "module"`) with consistent async arrow functions throughout.
  - Normalized central error handling returning standard `{ success: false, message }` responses.
  - Controller responses provide bare data, with paginated lists formatted as `{ data, pagination }`.
  - Type-safe contract mapping from Prisma camelCase fields to API snake_case fields via `formatDistrict`.

---

## 4. Understanding the Risk Model & Data

### Risk Score Calculation (0 – 100 scale)
Risk scores represent the likelihood of adverse agricultural yield loss, computed by an explainable, weighted rule-based model:
- **Yield Trend:** **35%** weight (deviation from multi-year historical yield baseline)
- **Rainfall Anomaly:** **30%** weight (deficit or severe excess precipitation)
- **Area Trend:** **20%** weight (contraction in cultivated acreage)
- **Price Volatility:** **15%** weight (mandi price volatility)

### Missing Signals & Data Quality
If historical data is missing for a signal, that signal is excluded and the remaining weights are dynamically re-normalized.
- **Complete:** All 4 signals available and computed.
- **Good:** 3 signals available; reliable score.
- **Limited:** 2 signals available (minimum threshold required to compute a score).
- **Very Limited / Insufficient:** &lt; 2 signals available; score is withheld to preserve data integrity.

> [!IMPORTANT]
> **A `null` or dash (`—`) risk score NEVER means zero risk.** It means there is insufficient historical baseline data to calculate trend anomalies (common in baseline years `2021-22` and `2022-23`).

### Metric Units (All Confirmed)
- **Cultivated Area:** `area_hectares` (hectares / ha)
- **Production:** `production_tonnes` (tonnes)
- **Yield:** `yield_kg_per_hectare` (kg/ha)
- **Precipitation:** `rainfall_mm` (mm)
- **Average Price:** `avg_price` (₹ per quintal / ₹/quintal — 1 quintal = 100 kg)

---

## 5. Local Setup & Running Locally

### Prerequisites
- Node.js (v18.x or higher)
- npm (v9.x or higher)
- Supabase account or PostgreSQL instance

### 1. Clone & Setup Backend
```bash
cd backend
npm install

# Create .env based on template
cp .env.example .env
```

Configure `backend/.env`:
```env
# Supabase Session Pooler URL (Port 5432)
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres"
PORT=8080
NODE_ENV=development
FRONTEND_URL="http://localhost:5173,http://localhost:3000"
```

Generate Prisma Client and apply migrations:
```bash
# Generate Prisma Client (Mandatory in Prisma 7)
npm run build

# Deploy migrations to database
npm run db:migrate

# (Optional) Import dataset idempotently if starting with a fresh database
npm run db:import

# Start backend server
npm start
```
*Backend will be running at `http://localhost:8080`.*

### 2. Setup Frontend
```bash
cd ../frontend
npm install

# Create .env based on template
cp .env.example .env
```

Configure `frontend/.env`:
```env
VITE_API_URL="http://localhost:8080/api/v1"
```

Start Vite dev server:
```bash
npm run dev
```
*Frontend will be running at `http://localhost:5173`.*

---

## 6. Critical Prisma 7 & Supabase Gotchas

1. **Prisma 7 Does Not Auto-Generate:**
   `npx prisma generate` is **not** run automatically after schema migrations in Prisma 7. Always run `npm run build` or `npx prisma generate` after modifying `prisma/schema.prisma`.
2. **Mandatory Driver Adapter:**
   Prisma 7 requires an explicit driver adapter. The shared client in `src/config/db.js` uses `@prisma/adapter-pg` with `DATABASE_URL`.
3. **Supabase IPv4 Connection Pooling:**
   Direct Supabase hosts (`db.<ref>.supabase.co`) use IPv6-only resolution, causing network failures on IPv4 networks. Always use the **Supabase Session Pooler** string on port `5432` (`postgres.<project-ref>@aws-0-<region>.pooler.supabase.com:5432/postgres`). Do not use the transaction pooler (port 6543) for migrations.
4. **Supabase Inactivity Pause:**
   Free-tier Supabase instances pause automatically after prolonged inactivity. If queries fail to connect with connection timeouts, visit the Supabase web dashboard to unpause the database.

---

## 7. Deployment Guide

### Backend Deployment (Render or Railway)
- **Root Directory:** `backend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Pre-deploy / Migration Command:** `npm run db:migrate`
- **Environment Variables:**
  - `DATABASE_URL`: Supabase Session Pooler URL (port 5432).
  - `PORT`: `8080` (or provided by host).
  - `NODE_ENV`: `production`.
  - `FRONTEND_URL`: URL of the deployed frontend (e.g., `https://crop-yield-risk.vercel.app`).

### Frontend Deployment (Vercel or Netlify)
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_URL`: URL of the deployed backend API (e.g., `https://crop-yield-risk-api.onrender.com/api/v1`).
- **SPA Rewrites:**
  - Vercel: Configured via `frontend/vercel.json` (rewrites all routes to `/index.html`).
  - Netlify: Configured via `frontend/public/_redirects` (`/*  /index.html  200`).

---

## 8. API Specification

All endpoints are hosted under `/api/v1`:

| Method & Route | Query / Path Parameters | Description | Sample Response |
|---|---|---|---|
| `GET /health` | None | Basic server health check | `{ success: true, message: "Server is Healthy", timestamp: "..." }` |
| `GET /filters` | None | Distinct dropdown values | `{ states: ["Haryana", ...], crops: ["Maize", ...], years: ["2024-25", ...] }` |
| `GET /districts` | `state`, `crop`, `year`, `page`, `limit` | Paginated district records. Defaults to latest year if `year` is omitted. Caps limit at 100. | `{ data: District[], pagination: { total, page, limit, totalPages } }` |
| `GET /district/:id` | `id` (integer) | Single district record plus complete chronological `trend: District[]` | `{ id, district, state, crop, year, risk_score, ..., trend: [...] }` |
| `GET /compare` | `ids` (comma-separated integers, min 2) | Comparative array of 2 or more districts | `[ District, District, ... ]` |

### District Data Contract (`District` Shape)
```json
{
  "id": 4,
  "district": "Ambala",
  "state": "Haryana",
  "crop": "Maize",
  "year": "2024-25",
  "rainfall_mm": 1447.69,
  "avg_price": 2215.36,
  "area_hectares": 0.0,
  "production": 0.0,
  "production_tonnes": 0.0,
  "yield_kg_per_hectare": 3714.0,
  "risk_score": 28.52,
  "risk_data_quality": "Good",
  "drivers_available": 3,
  "top_driver_1": "Price volatility",
  "top_driver_2": "Rainfall anomaly",
  "top_driver_3": null
}
```
