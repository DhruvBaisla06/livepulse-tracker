# LivePulse — Real-Time Personal Finance & Expense Analytics Platform

A commercial-grade fintech SaaS web application built with **React**, **Vite**, **Tailwind CSS**, and **Supabase**. LivePulse features an ultra-sleek **Glassmorphism** design system with real-time financial tracking, budget threshold triggers, multi-category budgeting, goal planning, and deep interactive analytics.

---

## 💎 Design System & Visual Identity

- **Palette**: Deep navy and cosmic purple gradient backgrounds (`#050510` -> `#161640`).
- **Surface**: Translucent frosted-glass cards with `backdrop-filter: blur(20px)` and thin 1px white borders at 10% opacity.
- **Accents**: Neon purple (`#8b5cf6`) and cyan (`#06b6d4`) highlights with soft ambient glows.
- **Typography**: Crisp, modern Inter sans-serif typeface.
- **Micro-interactions**: Fluid Framer Motion layout transitions, hover depth, and loading shimmers.

---

## ⚡ Core Capabilities

1. **Multi-User Authentication**: Supabase Auth integration with demo fallback session management.
2. **Real-Time Financial Dashboard**: Dynamic KPI stat cards for Total Income, Total Expenses, Net Savings, and Budget Remaining.
3. **Transaction Management (CRUD)**:
   - Filter by date range, type (Income / Expense), category, or keyword search.
   - In-place Edit and Delete modals with instant balance recalculation.
4. **Data Portability**: One-click **CSV export** (via PapaParse) and **Excel export** (via SheetJS / XLSX).
5. **Interactive Data Visualizations (Recharts)**:
   - 6-month historical Area Trend charts (Income vs Expense).
   - Monthly Comparative Bar Charts.
   - Category distribution Donut / Pie Charts with custom color palettes.
   - Daily spending intensity bar charts.
6. **Category-wise Budgeting**:
   - Monthly category limits with dynamic progress bars.
   - Automated threshold indicators: Green (Healthy), Amber (>=80% Warning), and Red (Over-budget).
7. **Savings Goals Tracker**:
   - Target milestones with percentage completion progress bars and target deadlines.
   - Direct "Add Money" micro-funding modal.
8. **Executive Financial Statements & Reports**:
   - Monthly statement cards, audited cash retention metrics, and printable summaries.
9. **Notification Center**: Real-time budget alerts, large expense spike warnings, and goal achievements.
10. **System Administration & Settings**: Tenant registry, category taxonomy manager, and currency configuration.

---

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite 6
- **Styling**: Tailwind CSS 4 with custom glass token system
- **State & Hooks**: React Context API + Custom analytical computation hooks
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Spreadsheets / CSV**: SheetJS (xlsx) + PapaParse
- **Date Handling**: date-fns

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### 2. Launch Development Server
```bash
# Navigate to project
cd Tracker

# Start development server
npm run dev
```

The app will launch at `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🗄️ Database Schema & Supabase Setup (Phase 2)

All database migrations are located at:
`supabase/migrations/001_initial_schema.sql`

Includes:
- `profiles` table with automatic signup triggers
- `categories` table with custom color and type constraints
- `transactions` table with indexes on `(user_id, date DESC)`
- `budgets` table with category-period uniqueness
- `savings_goals` table
- `notifications` table
- Full **Row Level Security (RLS)** policies enabled across all tables
- Realtime publication flags:
  ```sql
  ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
  ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  ```

To connect your Supabase instance, create a `.env` file in the root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```
