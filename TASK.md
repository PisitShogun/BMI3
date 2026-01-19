# Project Tasks: BMI Web Application

สถานะงาน: [ ] ยังไม่ทำ, [-] กำลังทำ, [x] เสร็จแล้ว

## Phase 1: Project Setup & Database Initialization
- [x] **1.1 Initialize Project**
  - [x] Create Next.js project (Latest version).
  - [x] Setup Tailwind CSS.
  - [x] Install dependencies: `better-sqlite3`, `clsx`, `tailwind-merge`.
  - [x] Install Auth dependencies: `bcryptjs` (for password hashing), `jose` (for JWT).
- [x] **1.2 Database Schema**
  - [x] Design Database Schema (Users, BMI Records).
  - [x] Create `lib/db.ts` for SQLite connection.
  - [x] Create initialization script (`scripts/init-db.js`) to create tables:
    - `users`: id, username, password_hash, created_at
    - `records`: id, user_id, weight, height, bmi, created_at

## Phase 2: Authentication (User Management)
- [x] **2.1 Backend: Auth APIs**
  - [x] Implement `POST /api/auth/register` (Validate & Create User).
  - [x] Implement `POST /api/auth/login` (Verify & Issue JWT Cookie).
  - [x] Implement `POST /api/auth/logout` (Clear Cookie).
  - [x] Create Middleware for protected routes.
- [x] **2.2 Frontend: Auth Pages**
  - [x] Create Login Page (`/login`).
  - [x] Create Register Page (`/register`).
  - [x] Integrate forms with Auth APIs.

## Phase 3: Core Feature (BMI Calculator)
- [x] **3.1 Backend: Records API**
  - [x] Implement `POST /api/bmi` to save record (Authenticated user only).
  - [x] Implement `GET /api/bmi/history` to fetch recent records.
- [x] **3.2 Frontend: Calculator**
  - [x] Create `BMICalculator` component (Input Weight/Height).
  - [x] Implement calculation logic & interpretation (Underweight, Normal, etc.).
  - [x] Display result immediately.
  - [x] Save result to database automatically.
- [x] **3.3 Frontend: Dashboard**
  - [x] Create Main Dashboard (`/dashboard`).
  - [x] Display BMI Calculator.
  - [x] Display Recent History list.

## Phase 4: MIS Reports (Analysis & Reporting)
- [x] **4.1 Backend: Report APIs**
  - [x] Implement `GET /api/reports/stats` with `period` parameter (daily, weekly, monthly, yearly).
  - [x] Write SQL queries for aggregation (Count, Average BMI).
- [x] **4.2 Frontend: MIS Page**
  - [x] Create MIS Report Page (`/reports`).
  - [x] Create UI controls to switch views (Day/Week/Month/Year).
  - [x] Display Summary Cards (Total Records, Avg BMI).
  - [x] Display Chart/Table for historical trends.

## Phase 5: Refinement & Testing
- [ ] **5.1 UI/UX Polish**
  - [ ] Improve responsiveness (Mobile/Desktop).
  - [ ] Add loading states and error handling.
- [ ] **5.2 Testing**
  - [ ] Test Multi-user isolation (User A should not see User B's data).
  - [ ] Verify BMI calculations.
  - [ ] Verify Report accuracy.
