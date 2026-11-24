# PROJECT REPORT & PRESENTATION DOSSIER

---

# 🚀 LivePulse
### **Real-Time Personal Finance & Expense Analytics Platform**

**Live Demo URL:** [https://livepulse-tracker.vercel.app](https://livepulse-tracker.vercel.app)  
**GitHub Repository:** [https://github.com/DhruvBaisla06/livepulse-tracker](https://github.com/DhruvBaisla06/livepulse-tracker)  
**Version:** `1.0.0 (Production Release)`  
**Domain:** Fintech / SaaS / Web Application Architecture  
**Developer / Presenter:** Dhruv Baisla  
**Date:** November 2026  

---

## 📑 TABLE OF CONTENTS
1. [Executive Summary / Abstract](#1-executive-summary--abstract)
2. [Problem Statement & Market Motivation](#2-problem-statement--market-motivation)
3. [Proposed Solution & Core Objectives](#3-proposed-solution--core-objectives)
4. [Technology Stack & System Architecture](#4-technology-stack--system-architecture)
5. [Key Modules & Functional Breakdown](#5-key-modules--functional-breakdown)
6. [Database Schema & ER Design](#6-database-schema--er-design)
7. [Security & Data Protection Framework](#7-security--data-protection-framework)
8. [UI/UX Design Philosophy (Glassmorphism)](#8-uiux-design-philosophy-glassmorphism)
9. [Data Visualization & Charting Engine](#9-data-visualization--charting-engine)
10. [Data Portability & Reporting (Excel / CSV)](#10-data-portability--reporting-excel--csv)
11. [Deployment, CI/CD & Build Optimization](#11-deployment-cicd--build-optimization)
12. [Future Roadmap & Scalability](#12-future-roadmap--scalability)
13. [Conclusion & Presentation Q&A Reference](#13-conclusion--presentation-qa-reference)

---

## 1. EXECUTIVE SUMMARY / ABSTRACT

**LivePulse** is a commercial-grade, multi-tenant web application engineered to solve the fragmentation, latency, and poor user engagement endemic to personal financial management. 

Traditional budgeting software either presents overwhelming enterprise spreadsheets or basic static expense trackers that require manual page reloads and lack visual engagement. **LivePulse** bridges this gap by combining:
- High-frequency **real-time synchronization** powered by WebSocket-based PostgreSQL publications.
- A futuristic, **Glassmorphism design system** featuring translucent frosted glass, dynamic depth, and responsive ambient lighting.
- Comprehensive financial utilities including **category-wise budget capping**, **threshold alerts (80% / 100%)**, **milestone-based savings goals**, **interactive analytics**, and **audited Excel/CSV exports**.

LivePulse is deployed on a global serverless edge network via Vercel and backed by a Supabase cloud relational PostgreSQL database protected by database-level Row Level Security (RLS).

---

## 2. PROBLEM STATEMENT & MARKET MOTIVATION

### The Problem:
1. **Manual Friction & Stale Data:** Most expense trackers store records in disconnected local storage or require manual page reloads to recalculate totals, resulting in discrepancies between dashboard cards and transaction logs.
2. **Lack of Visual Feedback:** Numeric text tables fail to communicate spending velocity or warn users before budgets are blown.
3. **Data Silos & Lack of Portability:** Users are locked into proprietary platforms with no easy path to export audited statements for accounting or tax filing.
4. **Security & Privacy Risks:** In multi-user setups, improper client-side data filtering risks leaking financial ledgers between tenants.

### The Opportunity:
To engineer a fintech web platform that delivers the latency-free responsiveness of desktop software, the security of bank-grade relational databases, and the aesthetic appeal of modern luxury consumer applications.

---

## 3. PROPOSED SOLUTION & CORE OBJECTIVES

| Objective | Architectural Implementation |
|---|---|
| **Zero-Latency State Sync** | Global `TransactionProvider` Context with Supabase Realtime WebSocket subscriptions. |
| **Complete Data Isolation** | PostgreSQL Row Level Security (RLS) policies strictly enforcing `auth.uid() = user_id`. |
| **Proactive Budget Defense** | Dynamic threshold calculations that categorize spending into Healthy, Warning (>=80%), and Exceeded (>=100%). |
| **Comprehensive Analytics** | Multi-dimensional Recharts suite (Area, Bar, Donut, Daily Intensity). |
| **Zero-Lockin Portability** | Dual-engine export suite supporting PapaParse (CSV) and SheetJS (native `.xlsx`). |
| **Universal Accessibility** | Fully responsive CSS grid/flexbox supporting Desktop, Tablet, and Mobile devices. |

---

## 4. TECHNOLOGY STACK & SYSTEM ARCHITECTURE

```
                               ┌────────────────────────────────────────────────┐
                               │           CLIENT / BROWSER INTERFACE           │
                               │  React 19 SPA · Tailwind CSS v4 · Recharts 3   │
                               └──────────────────────┬─────────────────────────┘
                                                      │
                                                      │ HTTPS / WSS
                                                      ▼
                               ┌────────────────────────────────────────────────┐
                               │           VERCEL EDGE GLOBAL NETWORK           │
                               │  SPA Rewrites (vercel.json) · Static CDN Assets│
                               └──────────────────────┬─────────────────────────┘
                                                      │
                         ┌────────────────────────────┴───────────────────────────┐
                         ▼                                                        ▼
         ┌───────────────────────────────┐                        ┌───────────────────────────────┐
         │     SUPABASE AUTH ENGINE      │                        │     SUPABASE POSTGRESQL 15+   │
         │  JWT Session / Token Handling │                        │  RLS Policies · Indexes · WSS │
         └───────────────────────────────┘                        └───────────────────────────────┘
```

### Stack Breakdown:
- **Programming Language:** Modern JavaScript (ECMAScript 2024 / ES Modules).
- **Core Frontend Framework:** **React 19** (`react`, `react-dom` v19.3.1).
- **Tooling & Bundler:** **Vite 6** (`vite` v8.3.8) with `@vitejs/plugin-react`.
- **Routing Engine:** **React Router v6** (`react-router-dom` v6.30.6) with Protected Route guards.
- **Styling Architecture:** **Tailwind CSS 4** (`tailwindcss` v4.3.5, `@tailwindcss/vite`).
- **Database & Backend:** **Supabase PostgreSQL 15+** with WebSocket Realtime Replication.
- **Data Visualization:** **Recharts 3** (`recharts` v3.11.0).
- **Animation Framework:** **Framer Motion 14** (`framer-motion` v14.14.0).
- **Iconography:** **Lucide React** (`lucide-react` v1.75.0).
- **Export Engines:** **SheetJS** (`xlsx` v0.18.5) + **PapaParse** (`papaparse` v5.7.1).
- **Date Utilities:** **date-fns** (`date-fns` v4.4.0).
- **Hosting / CI-CD:** **Vercel** with GitHub webhook automation.

---

## 5. KEY MODULES & FUNCTIONAL BREAKDOWN

### 5.1 Multi-Tier Authentication & Persona Segregation
LivePulse implements a smart multi-persona authentication structure:
1. **Registered Cloud User:** Connects directly to Supabase Auth and isolated PostgreSQL tables via RLS. Begins with a clean ledger and private cloud synchronization.
2. **Demo Persona (`demo@livepulse.app`):** Populates a complete 60-transaction personal ledger (Arjun Mehta) spanning 6 historical months, ideal for instant platform evaluation.
3. **Enterprise Admin Persona (`admin@livepulse.app`):** Demonstrates high-volume corporate cashflows (SaaS retainers, tech park leases, infrastructure clusters, angel distributions).

### 5.2 Real-Time Executive Dashboard
- **4 Primary Metric Cards:** Total Inflow, Total Outflow, Net Savings, and Budget Remaining with dynamic trend badges.
- **Interactive Visualizers:** Integrated Area Cashflow curves, Monthly Bar Comparisons, and Category Donut distributions.
- **Recent Ledger Widget:** Chronological list of the latest 8 transactions with category tags, relative timestamps, and color-coded values.
- **Budget Health Monitors:** Top 5 category progress bars with threshold warning badges.

### 5.3 Transaction Ledger (CRUD) & Advanced Filtering
- Search across descriptions, accounts, and category tags.
- Type filtering (All / Income / Expense).
- Category taxonomy selector.
- In-place Edit Modal with reactive state updates.
- Double-confirmation Delete Modal to prevent accidental financial erasure.
- Paginated table layout for desktop; responsive cards for mobile viewports.

### 5.4 Category Budgeting & Threshold Defense System
- Allows setting monthly spending caps across expense categories.
- Automatic real-time status calculation:
  - **Healthy (Green):** Spending < 80% of budget cap.
  - **Warning (Amber):** Spending between 80% and 100% of cap.
  - **Exceeded (Red):** Spending > 100% of cap.
- Add / Edit / Delete budget limits with immediate progress bar updates.

### 5.5 Savings Goals & Milestone Tracker
- Dedicated savings pots (e.g., Emergency Fund, Tech Refresh, Vacation, Vehicle).
- Tracks target amount, currently saved amount, and deadline date.
- Real-time animated percentage progress bars.
- Dedicated **"Add Money"** modal enabling micro-contributions that immediately update goal progress.

### 5.6 Financial Intelligence & Analytics Hub
- **Timeframe Selector:** 1 Month, 3 Months, 6 Months, and 1 Year horizons.
- **KPI Metrics:** Monthly Inflow, Monthly Outflow, Savings Retention Rate %, Average Daily Spend.
- **Daily Spending Intensity Bar Chart:** Day-by-day distribution for the current month.
- **Historical Month-over-Month Audit Table:** Trailing 6-month comparative matrix with savings rate tags.

### 5.7 Audited Financial Reports & Statement Generator
- Statement month selector.
- Executive summary card detailing total inflows, outflows, retained capital, and retention rate.
- One-click **Export to CSV** (via PapaParse).
- One-click **Export to Excel (.xlsx)** (via SheetJS).
- Print / PDF layout optimization via browser print stylesheets.

### 5.8 Notification Center
- Real-time alerts for budget threshold warnings, goal achievements, and high-value expenditure spikes.
- Filter by All, Unread, and Read status.
- Single-click "Mark all read" and "Clear all" actions.

### 5.9 System Administration & Telemetry
- System health telemetry monitors (RLS status, TLS level, client token leak check).
- Global category taxonomy registry with custom color assignment.
- Tenant and user overview cards.

---

## 6. DATABASE SCHEMA & ER DESIGN

The backend runs on PostgreSQL with strict referential integrity, check constraints, foreign keys, and indexes:

```
┌─────────────────────────────────┐           ┌─────────────────────────────────┐
│            PROFILES             │           │           CATEGORIES            │
├─────────────────────────────────┤           ├─────────────────────────────────┤
│ id: UUID (PK, FK auth.users)    │           │ id: UUID (PK)                   │
│ full_name: TEXT                 │           │ user_id: UUID (FK auth.users)   │
│ email: TEXT (UNIQUE)            │           │ name: TEXT                      │
│ avatar_url: TEXT                │           │ type: TEXT ('income'|'expense') │
│ currency: TEXT ('INR')          │           │ color: TEXT                     │
│ created_at: TIMESTAMPTZ         │           │ created_at: TIMESTAMPTZ         │
└────────────────┬────────────────┘           └────────────────┬────────────────┘
                 │                                             │
                 │                     1:N                     │
                 ├─────────────────────────────────────────────┤
                 │                                             │
┌────────────────▼────────────────┐           ┌────────────────▼────────────────┐
│          TRANSACTIONS           │           │             BUDGETS             │
├─────────────────────────────────┤           ├─────────────────────────────────┤
│ id: UUID (PK)                   │           │ id: UUID (PK)                   │
│ user_id: UUID (FK auth.users)   │           │ user_id: UUID (FK auth.users)   │
│ type: TEXT ('income'|'expense') │           │ category: TEXT                  │
│ category: TEXT                  │           │ limit: NUMERIC(12,2)            │
│ amount: NUMERIC(12,2)           │           │ period: TEXT ('monthly')        │
│ description: TEXT               │           │ color: TEXT                     │
│ date: DATE                      │           │ created_at: TIMESTAMPTZ         │
│ account: TEXT                   │           └─────────────────────────────────┘
│ created_at: TIMESTAMPTZ         │
└─────────────────────────────────┘
                 │
                 │                     1:N
                 ├─────────────────────────────────────────────┐
                 │                                             │
┌────────────────▼────────────────┐           ┌────────────────▼────────────────┐
│          SAVINGS_GOALS          │           │          NOTIFICATIONS          │
├─────────────────────────────────┤           ├─────────────────────────────────┤
│ id: UUID (PK)                   │           │ id: UUID (PK)                   │
│ user_id: UUID (FK auth.users)   │           │ user_id: UUID (FK auth.users)   │
│ name: TEXT                      │           │ type: TEXT ('info'|'warn'|etc)  │
│ target: NUMERIC(12,2)           │           │ title: TEXT                     │
│ saved: NUMERIC(12,2)            │           │ message: TEXT                   │
│ deadline: DATE                  │           │ read: BOOLEAN (DEFAULT FALSE)   │
│ created_at: TIMESTAMPTZ         │           │ created_at: TIMESTAMPTZ         │
└─────────────────────────────────┘           └─────────────────────────────────┘
```

### Key Performance Indexes:
- `idx_transactions_user`: `(user_id)`
- `idx_transactions_date`: `(user_id, date DESC)`
- `idx_budgets_user`: `(user_id)`
- `idx_savings_user`: `(user_id)`
- `idx_notifications_unread`: `(user_id, read) WHERE NOT read`

---

## 7. SECURITY & DATA PROTECTION FRAMEWORK

### 7.1 Row Level Security (RLS)
Every user-owned table enforces PostgreSQL RLS:
```sql
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own transactions" ON transactions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```
**Impact:** Even if a malicious actor crafts a manual SQL query targeting another user's UUID, the database engine drops the request at the kernel level with zero rows returned.

### 7.2 Zero Service-Key Exposure
The frontend application only possesses the public `VITE_SUPABASE_ANON_KEY`. The privileged `service_role` master key is **never** committed or packaged into client bundles.

### 7.3 Real-Time WebSocket Channel Isolation
Supabase Realtime subscriptions are filtered directly by `user_id`:
```javascript
channel = supabase.channel(`transactions_user_${user.id}`).on(
  'postgres_changes',
  { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` },
  payload => { /* reactive update */ }
);
```

---

## 8. UI/UX DESIGN PHILOSOPHY (GLASSMORPHISM)

Rather than using generic, flat corporate dashboards, LivePulse is styled with a custom **Glassmorphism Design System**:

- **Cosmic Gradient Canvas:** Multi-point radial and linear gradients shifting from Midnight Obsidian (`#050510`) to Deep Indigo (`#161640`).
- **Frosted Translucency:** Applied via `backdrop-filter: blur(20px)` and semi-transparent alpha backgrounds (`rgba(255, 255, 255, 0.05)`).
- **Subtle Surface Definition:** 1px borders at 10% opacity simulate polished glass edges under light.
- **Lighting Accents:**
  - Neon Cyan (`#06b6d4` / `rgb(6, 182, 212)`): Active controls, system badges, inflow metrics.
  - Electric Purple (`#8b5cf6` / `rgb(139, 92, 246)`): Brand identity, primary CTAs, savings metrics.
  - Emerald Green (`#10b981`): Inflows, positive trends, healthy budgets.
  - Coral Crimson (`#ef4444`): Outflows, deficit indicators, exceeded limits.
- **Micro-Interactions:** Buttons feature subtle scale down on press (`whileTap={{ scale: 0.98 }}`) and smooth hover lifts (`whileHover={{ scale: 1.02 }}`) powered by Framer Motion.

---

## 9. DATA VISUALIZATION & CHARTING ENGINE

All data graphics are rendered using **Recharts 3**, leveraging SVG vector scalability for crystal-clear fidelity across high-DPI (Retina) displays:

1. **Area Cashflow Chart (`SpendingTrend.jsx`):**
   - Renders 6-month dual income/expense curves.
   - Dual SVG linear gradients (`colorIncome` & `colorExpenses`) with variable vertical opacity (30% to 0%).
2. **Comparative Bar Chart (`IncomeVsExpense.jsx`):**
   - Side-by-side comparative bars featuring rounded top corners (`radius={[6, 6, 0, 0]}`).
   - Formatted INR currency tooltips.
3. **Category Distribution Donut (`CategoryPie.jsx`):**
   - Donut architecture (`innerRadius={65}`, `outerRadius={100}`).
   - High-contrast 15-color palette mapping to specific expense taxonomies.
4. **Daily Spending Intensity (`Analytics.jsx`):**
   - Visualizes day-by-day cash burn for the active calendar month.

---

## 10. DATA PORTABILITY & REPORTING (EXCEL / CSV)

To ensure zero vendor lock-in, LivePulse incorporates high-performance client-side file generators:

```javascript
// Native Excel Workbook Generation via SheetJS
const worksheet = XLSX.utils.json_to_sheet(dataToExport);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
XLSX.writeFile(workbook, `livepulse_statement_${date}.xlsx`);

// RFC 4180 Compliant CSV Generation via PapaParse
const csv = Papa.unparse(dataToExport);
const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
```
- No server compute cost: Files are assembled and downloaded directly within the client browser thread.

---

## 11. DEPLOYMENT, CI/CD & BUILD OPTIMIZATION

- **Hosting Platform:** **Vercel Edge Network**.
- **Continuous Deployment:** Every Git commit pushed to `origin/main` automatically triggers a cloud build, runs linting, and deploys atomically with instant rollback capabilities.
- **SPA Rewrites:** Controlled via `vercel.json`:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
  Prevents 404 errors on deep-route page refreshes (e.g., `/analytics`, `/budgets`).
- **Production Build Benchmarks:**
  - Build Duration: **~2.18 seconds** on Vercel Edge.
  - Output Assets: Minified JavaScript + Tree-shaken CSS bundle (~62 kB gzip: 9.5 kB).

---

## 12. FUTURE ROADMAP & SCALABILITY

1. **AI-Powered Financial Copilot (Gemini / LLM Integration):**
   - Natural language queries (e.g., *"How much did I spend on dining out last weekend?"*).
   - Automated predictive anomaly detection (e.g., *"Your electricity bill is 40% higher than last month"*).
2. **Open Banking / Account Aggregator API Integration:**
   - Automatic bank feed ingestion via Setu / Plaid / Account Aggregator framework.
3. **Receipt OCR Scanner:**
   - Direct camera photo capture of paper invoices converted into auto-categorized expense records using Computer Vision.
4. **Progressive Web App (PWA):**
   - Service worker offline caching and native home screen installation for iOS and Android.

---

## 13. CONCLUSION & PRESENTATION Q&A REFERENCE

### Summary of Achievements:
- Designed and built a complete, production-ready fintech SaaS platform in React 19 and Vite.
- Implemented real-time bi-directional database synchronization with Supabase PostgreSQL.
- Enforced strict database-level Row Level Security (RLS) for privacy.
- Created an award-winning Glassmorphism UI with interactive charts, financial budget guards, and instant Excel/CSV data exports.
- Deployed live on Vercel with zero downtime CI/CD.

### Quick Presentation Talking Points (Q&A):
- **Q: How does LivePulse prevent one user from seeing another user's financial data?**  
  *A: Through PostgreSQL Row Level Security (RLS) policies. Every query automatically verifies `auth.uid() = user_id` inside the database kernel before returning rows.*
- **Q: Why was Recharts chosen over Chart.js?**  
  *A: Recharts is built natively with React components and SVG. It provides declarative JSX syntax, superior responsive scaling via `<ResponsiveContainer>`, and avoids Canvas pixelation.*
- **Q: Does adding a transaction require refreshing the page?**  
  *A: No. State updates reactively through the global `TransactionProvider` and Supabase Realtime WebSocket subscriptions, refreshing charts, balances, and lists instantly.*

---

**© 2026 LivePulse Platform — Engineered by Dhruv Baisla**
