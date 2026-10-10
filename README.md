# TaskFlow — Modern Industrial To-Do Application

A production-grade, highly responsive, and accessible To-Do List application built with **React 19** and **Vite**, featuring Vanilla CSS design tokens, persistent local storage, productivity analytics, comprehensive automated QA tests, and multi-stage Docker containerization.

Built as part of the **ShopBack Engineering Intern Take-Home Assessment**.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- *(Optional)* **Docker**: If running via container

---

### Option A: Standard Local Setup (Recommended)

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to the printed local URL (typically [http://localhost:5173](http://localhost:5173)).

3. **Run Automated QA Test Suites:**
   - **Unit & Integration Tests (Vitest):**
     ```bash
     npm test
     ```
     Runs 5 unit & integration tests covering edge cases, persistence, and CRUD mutations.
   - **End-to-End Browser Automation (Playwright):**
     ```bash
     npm run test:e2e
     ```
     Executes 9 full browser automation tests on Chrome verifying real UI flows, modals, and theme switching.

4. **Production Build & Preview:**
   ```bash
   npm run build
   npm run preview
   ```

---

### Option B: Production Docker Deployment (macOS, Windows, & Linux)

A lightweight, multi-stage Docker setup serves the optimized production bundle via Nginx. It is fully compatible with **macOS (Apple Silicon M1/M2/M3/M4 & Intel)**, Windows, and Linux.

#### Method 1: Using Docker Compose (Simplest — 1 Command)
```bash
docker compose up --build -d
```
Visit **[http://localhost:8080](http://localhost:8080)** in your browser.

To stop the container:
```bash
docker compose down
```

#### Method 2: 1-Click Script
* **macOS / Linux:**
  ```bash
  chmod +x run-docker.sh
  ./run-docker.sh
  ```
* **Windows (PowerShell):**
  ```powershell
  .\run-docker.ps1
  ```

#### Method 3: Standard Docker CLI
```bash
docker build -t shopback-taskflow:latest .
docker run -d -p 8080:80 --name taskflow-app shopback-taskflow:latest
```

---

## ✨ Features & Engineering Highlights

- **Full CRUD Operations with Safety Workflows:**
  - **Create:** Rapid task entry with Enter key; expandable panel for description, priority, category, and due date.
  - **Read:** Task cards featuring priority color accent bars, category tags, and relative due-date alerts (*Due Today*, *Overdue*, *Tomorrow*).
  - **Update:** Accessible modal dialog with focus management and Esc key dismiss.
  - **Delete:** Protected by a reusable `ConfirmDialog` to prevent accidental data loss.
- **Completion Tracking:** Circular toggle with animated checkmark and strikethrough typography.
- **Productivity Dashboard:** Real-time metrics (Total, In Progress, Completed) and animated percentage completion progress bar.
- **Compound Search & Multi-Criteria Filtering:**
  - Real-time search across task titles and notes.
  - Status tabs: *All Tasks*, *Active*, *Completed*.
  - Category filters: *Work*, *Personal*, *Study*, *Health*, *Other*.
  - Priority filters: *High*, *Medium*, *Low*.
  - Multi-criteria sorting: *Newest First*, *Oldest First*, *Priority (High → Low)*, *Due Date*.
- **Defensive Persistence Layer:**
  - Synchronized with `localStorage` under versioned key `shopback_tasks_v1`.
  - Wrapped in defensive `try/catch` with automatic fallback to seed data on corrupted JSON or storage quota limits.
- **Design & Accessibility:**
  - Dark Mode and Light Mode with system preference detection and persistent preference memory.
  - Modern typography powered by Google Fonts (*Plus Jakarta Sans*).
  - Semantic HTML (`button`, `input`, `dialog`, `article`), keyboard ergonomics, and focus rings.

---

## 📁 Project Structure

```
├── Screenshots/                     # UI and feature demonstration captures
├── src/
│   ├── components/
│   │   ├── ConfirmDialog.jsx        # Safe destructive action modal
│   │   ├── EditTaskModal.jsx        # Task edit modal with focus management
│   │   ├── Header.jsx               # Header with logo, date, and theme toggle
│   │   ├── StatsOverview.jsx        # Real-time metrics and progress bar
│   │   ├── TaskForm.jsx             # Task creation form with expandable options
│   │   ├── TaskItem.jsx             # Individual task item card
│   │   ├── TaskList.jsx             # Task list container & friendly empty state
│   │   └── TaskToolbar.jsx          # Search, status tabs, filters, and sorting
│   ├── hooks/
│   │   └── useTaskManager.js        # Pure taskReducer and custom state hook
│   ├── test/
│   │   ├── setup.js                 # Vitest matchers setup
│   │   └── TaskFlow.test.jsx        # Automated unit and edge case tests
│   ├── constants.js                 # Categories, priorities, and initial seed data
│   ├── App.jsx                      # App controller wiring components & toasts
│   ├── App.css                      # Responsive layout and component styles
│   ├── index.css                    # Design tokens (dark/light) & global CSS reset
│   └── main.jsx                     # React entry point
├── e2e/                             # End-to-End browser automation tests
│   └── taskflow.spec.js             # Playwright test scenarios
├── Dockerfile                       # Multi-stage production Docker build
├── docker-compose.yml               # Docker Compose service definition
├── nginx.conf                       # Production Nginx SPA configuration
├── run-docker.sh                    # 1-click execution script for macOS & Linux
├── run-docker.ps1                   # 1-click execution script for Windows
├── .dockerignore                    # Exclusions for container build
├── .gitignore                       # Standard Git ignore file
├── prompt.md                        # Exact initial AI prompt used
├── reflection.md                    # AI usage write-up (<500 words) answering rubric questions
├── package.json                     # Dependencies and npm scripts
├── playwright.config.js             # Playwright E2E configuration
├── vite.config.js                   # Vite and Vitest configuration
└── README.md                        # Documentation and quick start guide
```

---

## 🛠️ Technology Stack

- **Framework:** React 19 + Vite 6
- **State Architecture:** Custom Hook (`useTaskManager`) with pure reducer (`useReducer`)
- **Testing:** Vitest + React Testing Library + jsdom
- **Icons:** Lucide React
- **Styling:** Vanilla CSS with CSS Custom Properties (Design Tokens)
- **Deployment:** Docker + Nginx Alpine
