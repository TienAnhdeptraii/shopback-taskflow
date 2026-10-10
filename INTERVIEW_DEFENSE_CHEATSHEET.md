# ShopBack Technical Interview Defense & Code Walkthrough Cheatsheet

> **Role:** Engineering Intern (ShopBack)  
> **Context:** Preparing to defend your take-home project in the live technical interview round.  
> **Goal:** Prove beyond doubt that you possess strong engineering taste, understand every line of shipped code, and used AI strictly as a productivity accelerator.

---

## 1. The 60-Second Opening Pitch

When the interviewer starts with:  
> *"Can you walk us through what you built and how you approached this challenge?"*

### Your Rehearsed Response:
> *"Instead of immediately prompting AI to generate an entire application, I started by establishing an architectural specification. I broke down the requirements into four decoupled layers: a strict data contract for the `Task` entity, a pure state reducer encapsulated in a custom `useTaskManager` hook, a defensive `localStorage` persistence layer with schema versioning (`shopback_tasks_v1`), and modular UI components with native CSS design tokens.*  
>  
> *I leveraged AI for rapid boilerplate generation, but I retained 100% ownership of business invariants. In particular, I caught and corrected several AI failure modes—such as whitespace submission bypass, unconfirmed deletions, and intraday date math bugs. Finally, to ensure industrial-grade reliability, I authored automated Vitest suites and containerized the production build using a multi-stage Docker setup with Nginx."*

---

## 2. Anticipated Technical Questions & Model Answers

### Question 1: "Why did you choose `useReducer` inside a custom hook over Redux or Zustand?"
* **Junior Answer:** *"Because I didn't want to install extra libraries."*
* **Industrial-Grade Answer (Say this):**  
  > *"For an application of this scope, Redux Toolkit or Zustand introduces unnecessary dependency weight and setup boilerplate. React's native `useReducer` gives us the exact same benefit: **deterministic, unidirectional data flow with pure transition functions**.*  
  > *By keeping `taskReducer` a pure function `(state, action) => newState`, state mutations are completely decoupled from UI rendering, making them 100% unit-testable without mocking React. Encapsulating this inside `useTaskManager` cleanly exposes public dispatch handlers (`addTask`, `toggleTask`, etc.) while keeping internal state mutations encapsulated."*

---

### Question 2: "What happens if a user opens the app in Safari Private Browsing mode or fills up `localStorage`?"
* **Industrial-Grade Answer:**  
  > *"Native `localStorage` throws a `QuotaExceededError` or a `SecurityError` when storage is restricted or full. If left unhandled, it crashes the entire React component tree.*  
  > *In `useTaskManager.js`, I wrapped every storage read and write inside defensive `try/catch` blocks. If `getItem` fails or contains corrupted JSON, the application logs a warning and falls back to default seed tasks. If `setItem` fails during runtime, it logs the exception, displays a friendly toast, and allows the in-memory state to remain fully interactive without crashing."*

---

### Question 3: "Walk me through how your due date comparison works in `TaskItem.jsx`."
* **The Code in Question:**
  ```javascript
  const targetDate = new Date(year, month - 1, day, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((targetDate - today) / (1000 * 60 * 60 * 24));
  ```
* **Industrial-Grade Answer:**  
  > *"The initial AI code compared `new Date(task.dueDate) < new Date()`. That was a critical bug because comparing exact timestamps means a task due today would be marked 'Overdue' at 9:00 AM because current time is later than midnight UTC.*  
  > *To fix this, I normalized both the target date and current date to local midnight (`00:00:00`). This converts the comparison into integer calendar days, accurately categorizing tasks as 'Overdue' (< 0), 'Due Today' (== 0), or 'Due Tomorrow' (== 1).*"

---

### Question 4: "Why did you use `useMemo` for `stats` and `filteredTasks`?"
* **Industrial-Grade Answer:**  
  > *"`tasks` array can contain dozens or hundreds of items. When the user types into the search input, every keystroke triggers a component re-render. Without `useMemo`, we would be re-filtering, sorting, and recalculating counters unnecessarily on unrelated render passes.*  
  > *`useMemo` ensures that compound filter queries and statistical aggregations only execute when their specific dependencies (`tasks`, `searchQuery`, `statusFilter`, `categoryFilter`, `priorityFilter`, `sortBy`) actually change."*

---

### Question 5: "Why did you write the automated tests yourself instead of asking AI to write both?"
* **Industrial-Grade Answer:**  
  > *"Letting an AI write both application code and tests creates a severe confirmation bias trap: the AI will write tests that pass based on its own flawed assumptions.*  
  > *For example, AI initially assumed `title.length > 0` was sufficient validation. If AI wrote the test, it would have tested `title = 'Buy milk'`, which passes. By hand-authoring the test with edge cases like `title = '     '` (pure whitespace), the test failed and forced us to implement strict `.trim()` validation in both the UI and reducer."*

---

### Question 6: "How would you scale this application to support 50,000 tasks?"
* **Industrial-Grade Answer:**  
  > *"If scaling to 50,000 tasks, I would make three architectural changes:*  
  > 1. **DOM Virtualization:** *Use `@tanstack/react-virtual` or `react-window` so only the 15–20 visible cards are rendered in the DOM, keeping rendering speed at 60fps.*  
  > 2. **Storage Migration:** *`localStorage` is synchronous and limited to ~5MB, which would freeze the UI thread on large serializations. I would migrate persistence to **IndexedDB** using `idb` or Dexie.js for asynchronous, multi-megabyte storage.*  
  > 3. **Off-Thread Searching:** *Move filtering, regex search, and sorting into a **Web Worker** with a search index (e.g. FlexSearch or MiniSearch) so complex queries never block main-thread UI interactions."*

---

### Question 7: "Why did you include Docker in your submission?"
* **Industrial-Grade Answer:**  
  > *"In a professional production pipeline, Single Page Applications are rarely served using a dev server. I created a multi-stage `Dockerfile` where Stage 1 builds the static assets with `node:20-alpine`, and Stage 2 serves them using an optimized `nginx:alpine` image with SPA client-side routing rewrites (`try_files $uri /index.html`).*  
  > *This produces an ultra-lean container under 25MB with minimal attack surface, demonstrating production and DevOps awareness."*

---

## 3. Live Coding / Modification Preparedness

Interviewers often ask you to make a small live change during the interview to test if you know your codebase. Here are the 3 most likely requests and how to execute them quickly:

### Live Request A: "Add a new Priority level: 'Urgent' (Red/Pulse)"
1. Open [src/constants.js](file:///c:/Users/admin/Desktop/Study/temp/Test(2)/src/constants.js):
   Add `{ id: 'urgent', label: 'Urgent', color: '#dc2626', weight: 4 }` to `PRIORITIES`.
2. Open [src/App.css](file:///c:/Users/admin/Desktop/Study/temp/Test(2)/src/App.css):
   Add `.priority-pill.priority-urgent { background: rgba(220, 38, 38, 0.2); color: #dc2626; font-weight: 800; }`.
3. Done! The dropdowns, filters, and priority weights update automatically because the app is data-driven.

### Live Request B: "Add a button to duplicate a task"
1. In `useTaskManager.js`, add action:
   ```javascript
   case 'DUPLICATE_TASK': {
     const task = state.find(t => t.id === action.payload);
     if (!task) return state;
     const copy = { ...task, id: crypto.randomUUID(), title: `${task.title} (Copy)`, createdAt: new Date().toISOString() };
     return [copy, ...state];
   }
   ```
2. Pass `onDuplicate` down to `TaskItem.jsx` and render a `Copy` icon button.

### Live Request C: "Add an export tasks to JSON button"
1. In `Header.jsx` or `TaskToolbar.jsx`:
   ```javascript
   const exportJSON = () => {
     const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = `tasks_${new Date().toISOString().slice(0,10)}.json`;
     a.click();
   };
   ```

---

*Keep this document open during your interview preparation.*
