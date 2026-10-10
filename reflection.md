# AI Usage Reflection

### 1. How did you break down the problem before prompting?
Before writing any prompts, I systematically decoupled the application into four distinct engineering layers:
- **Domain & Data Contract:** Defined a strict `Task` entity (UUID, title, description, priority, category, normalized dueDate, completion flag, and ISO timestamps).
- **State Machine Architecture:** Chose React's native `useReducer` encapsulated in a custom `useTaskManager` hook to guarantee deterministic, pure state transitions without introducing unnecessary external state dependencies.
- **Persistence & Resilience Strategy:** Established a versioned storage key (`shopback_tasks_v1`) protected by defensive `try/catch` boundaries and fallback seed data to handle private browsing and corrupted JSON without crashing the application.
- **Component Hierarchy & UX:** Mapped the UI into focused, single-responsibility components (`Header`, `StatsOverview`, `TaskForm`, `TaskToolbar`, `TaskList`, `EditTaskModal`, `ConfirmDialog`) powered by CSS design tokens for zero-runtime dark/light theming.

---

### 2. What did the AI get wrong, and how did you fix it?
During initial code generation, the AI introduced several critical flaws:
- **Whitespace Validation Bypass:** The AI relied on a naive length check (`title.length > 0`), which permitted users to submit blank tasks containing only spaces (`"   "`). I enforced strict `.trim()` sanitization in both the form and reducer, complete with user error feedback.
- **Destructive Action Safety Hazard:** The AI wired task deletion directly to click events. I intervened by introducing an accessible `ConfirmDialog` barrier to prevent accidental data loss.
- **Intraday Date Math Bug:** The AI evaluated overdue status by comparing raw strings against `new Date()`. Because of intraday timestamps, tasks due today were falsely flagged as "Overdue" at 9 AM. I normalized both target and current dates to local midnight (`00:00:00`) for accurate day-level comparisons.
- **Unprotected Storage I/O:** AI generated unshielded `localStorage` calls. I refactored hydration and persistence into safe wrappers with error logging and quota recovery.

---

### 3. What did you deliberately *not* delegate to AI, and why?
- **Architectural Boundaries & Data Schemas:** I explicitly designed the component hierarchy, state action contracts, and storage schemas myself to prevent AI from producing an unmaintainable monolith.
- **Test Specification Authoring:** Having AI author both application code and tests creates a circular validation risk where flawed assumptions are affirmed. I manually specified test assertions for edge-case trimming, safe deletion, and persistence to establish an independent source of truth.
- **UX & Keyboard Ergonomics Verification:** I manually audited focus transitions, modal dismissal via the `Escape` key, and screen reader-friendly labels.

---

### 4. What would you do differently with more time?
- **Comprehensive E2E Testing & CI/CD:** Implement Playwright suites for full cross-browser user journeys and a GitHub Actions pipeline running automated linting, test suites, and Docker image builds.
- **Drag-and-Drop Reordering:** Integrate keyboard-accessible drag-and-drop prioritization using `@dnd-kit`.
- **IndexedDB & Background Sync:** Migrate client storage to IndexedDB with Web Workers to handle large datasets (>10,000 tasks) without blocking the main UI thread.
