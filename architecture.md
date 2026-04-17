# Expense Tracker — Technical Architecture

**Version:** 1.0  
**Date:** 2026-04-17  
**Architect:** Winston  
**Status:** READY FOR IMPLEMENTATION

---

## 1. System Overview

The Expense Tracker is a privacy-first, client-side web application for personal expense management. All data is stored locally in the browser via localStorage, ensuring no backend infrastructure or cloud dependencies.

**Key Characteristics:**
- **Single-page application (SPA)** with instant UI updates
- **Zero backend:** All logic runs in the browser
- **Offline-first:** Works entirely without network connectivity
- **Privacy-preserving:** No data ever leaves the user's device
- **Responsive:** Optimized for desktop, tablet, and mobile
- **Deployable:** Static site ready for Netlify/GitHub Pages

**Core Value Proposition:**
Users can quickly log expenses, visualize spending patterns, track budgets, and export data—all without creating accounts or sharing personal information.

---

## 2. Tech Stack Justification

### Why React + Recharts + Vite

| Technology | Choice | Justification |
|---|---|---|
| **Frontend Framework** | React 18 | Component reusability, excellent state management ecosystem, rich community. Perfect for a dashboard UI with real-time updates. |
| **Build Tool** | Vite | 10x faster than Webpack. Instant HMR (hot module reload) for development. Optimized production builds with tree-shaking and code-splitting. Minimal config. |
| **Charting Library** | Recharts | React-native, composable charts. Excellent responsiveness. No jQuery or D3 boilerplate. Supports pie, bar, and line charts out of the box. Perfect for monthly summaries. |
| **State Management** | React Context + useReducer | Lightweight, no external dependencies. Sufficient for this data scope (100-1000 expenses). Avoids Redux boilerplate. |
| **Styling** | Tailwind CSS | Utility-first, no CSS-in-JS overhead. Fast development. Mobile-first responsive design built-in. 50KB gzipped. |
| **Persistence** | localStorage API | Native browser storage. No size limits for our use case (~1MB for 1000+ expenses). Synchronous access (fast). No IndexedDB complexity needed. |
| **CSV Export** | Papa Parse | Lightweight CSV parser/generator. Handles edge cases (commas, quotes, newlines). No server required. |
| **Date Handling** | date-fns | Lightweight alternative to Moment.js. Tree-shakeable. Localization support if needed later. |
| **Testing** | Vitest + React Testing Library | Fast, ESM-native testing. React Testing Library enforces best practices (test user behavior, not implementation). |
| **Deployment** | Netlify | Zero-config static hosting. Auto-deploys from Git. CDN included. Perfect for SPAs. |

**Why NOT:**
- **Vue/Svelte:** React's ecosystem is larger; team familiarity assumed.
- **Next.js:** Overkill for a static SPA; adds unnecessary server complexity.
- **Redux:** Over-engineered for this data shape (single object tree).
- **D3.js:** Verbose. Recharts is simpler for standard charts.
- **IndexedDB:** localStorage is sufficient; adds complexity without need.

---

## 3. React Component Tree & File Structure

```
expense-tracker/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── tsconfig.json (or .js without types)
├── .env.example
│
├── src/
│   ├── main.jsx              # Entry point
│   ├── App.jsx               # Root component, router
│   ├── index.css             # Global styles
│   │
│   ├── components/           # Reusable UI components
│   │   ├── Dashboard.jsx     # Main dashboard container
│   │   ├── AddExpenseForm.jsx
│   │   ├── ExpenseList.jsx
│   │   ├── ChartDisplay.jsx
│   │   ├── BudgetProgress.jsx
│   │   ├── Settings.jsx
│   │   ├── MonthSelector.jsx
│   │   ├── Navbar.jsx
│   │   ├── Modal.jsx         # Reusable modal wrapper
│   │   └── ConfirmDialog.jsx # Reusable confirmation dialog
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useExpenses.js    # Expenses CRUD + localStorage sync
│   │   ├── useSettings.js    # Settings state + localStorage sync
│   │   ├── useMonth.js       # Current month state
│   │   └── useLocalStorage.js # Generic localStorage hook
│   │
│   ├── context/              # React Context providers
│   │   ├── ExpenseContext.jsx
│   │   ├── SettingsContext.jsx
│   │   └── AppProvider.jsx   # Wrapper combining all contexts
│   │
│   ├── utils/                # Utility functions (no deps)
│   │   ├── storage.js        # localStorage get/set/clear
│   │   ├── calculations.js   # sum, average, filter by month/category
│   │   ├── csv.js            # CSV generation & download
│   │   ├── validation.js     # Input validation (amount, category, date)
│   │   └── constants.js      # PRESET_CATEGORIES, DEFAULT_BUDGET, etc.
│   │
│   ├── services/             # Business logic layer
│   │   ├── ExpenseService.js # CRUD operations, calculations
│   │   ├── SettingsService.js
│   │   └── ExportService.js  # CSV export logic
│   │
│   └── styles/               # Tailwind config + custom CSS if needed
│       └── globals.css
│
├── tests/
│   ├── unit/
│   │   ├── calculations.test.js
│   │   ├── validation.test.js
│   │   ├── csv.test.js
│   │   └── storage.test.js
│   └── integration/
│       ├── ExpenseService.test.js
│       └── Dashboard.integration.test.js
│
├── public/
│   ├── favicon.ico
│   └── manifest.json (PWA metadata)
│
└── docs/
    ├── API.md               # Service layer contracts
    ├── DEVELOPMENT.md       # Local setup & dev guide
    └── DEPLOYMENT.md        # Netlify build & deploy
```

---

## 4. Component Responsibility Matrix

| Component | Purpose | Props | State | Key Methods |
|---|---|---|---|---|
| **App** | Route container, theme provider | — | currentView | setView() |
| **Dashboard** | Main page, layout orchestrator | — | selectedMonth | renderMonthSummary() |
| **AddExpenseForm** | Add/edit expense modal | expense?, onSave, onCancel | formData, errors | handleSubmit(), validate() |
| **ExpenseList** | Filterable expense table | expenses, month, category?, onEdit, onDelete | sortBy | renderExpense(), handleDelete() |
| **ChartDisplay** | Pie/bar chart for month | expenses, month | chartType | handleCategoryClick() |
| **BudgetProgress** | Budget progress bar + alert | spent, budget, currency | warningLevel | calculateProgress() |
| **MonthSelector** | Month/year navigation | currentMonth, onMonthChange | — | previousMonth(), nextMonth() |
| **Settings** | Category & budget management | categories, budget, onSave | formData | handleAddCategory(), handleDeleteCategory() |
| **Modal** | Generic modal wrapper | children, onClose, title | — | — |
| **ConfirmDialog** | Generic confirmation dialog | message, onConfirm, onCancel, type | — | — |

---

## 5. Data Models & localStorage Schema

### 5.1 Core Data Structures

```typescript
// Expense object
{
  id: string,              // UUID or timestamp-based ID
  amount: number,          // Always in cents (e.g., 1500 = $15.00)
  category: string,        // e.g., "Food", "Transport", "Custom"
  date: string,            // ISO 8601: "2026-04-17"
  note: string,            // Optional user note, max 255 chars
  createdAt: number,       // Timestamp (ms), for sorting
  updatedAt: number        // Timestamp (ms), for last-modified tracking
}

// Settings object
{
  categories: {
    preset: [string],      // Always: ["Food", "Transport", "Rent", "Entertainment", "Other"]
    custom: [string]       // User-added: e.g., ["Utilities", "Groceries"]
  },
  monthlyBudget: number,   // In cents, 0 = unset
  currency: string,        // e.g., "USD", for display only
  theme: string,           // "light" | "dark" (future)
  locale: string           // e.g., "en-US", for formatting
}

// Monthly totals (computed, not stored)
{
  month: string,           // "2026-04"
  total: number,           // Sum of amounts in cents
  byCategory: {
    "Food": number,
    "Transport": number,
    ...
  },
  count: number            // Number of expenses
}
```

### 5.2 localStorage Schema

```json
{
  "expense-tracker:expenses": [
    {
      "id": "exp_1713348000000",
      "amount": 1500,
      "category": "Food",
      "date": "2026-04-17",
      "note": "Lunch with client",
      "createdAt": 1713348000000,
      "updatedAt": 1713348000000
    },
    ...
  ],
  "expense-tracker:settings": {
    "categories": {
      "preset": ["Food", "Transport", "Rent", "Entertainment", "Other"],
      "custom": ["Utilities", "Groceries"]
    },
    "monthlyBudget": 500000,
    "currency": "USD",
    "theme": "light",
    "locale": "en-US"
  },
  "expense-tracker:appState": {
    "lastSelectedMonth": "2026-04",
    "lastOpenedCategory": null
  }
}
```

**Storage Sizing:**
- 1 expense ≈ 200 bytes JSON
- 1000 expenses ≈ 200 KB
- Settings ≈ 2 KB
- **Total headroom:** ~50 MB available in localStorage (browser limit typically 5-10 MB)
- **Safe limit:** 5000+ expenses before optimization needed

---

## 6. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    React Component Tree                      │
└─────────────────────────────────────────────────────────────┘
              ↓                       ↓                       ↓
         ┌────────┐             ┌─────────┐            ┌──────────┐
         │ Context │             │  Hooks  │            │ Services │
         │Providers│             │(Custom) │            │  (Logic) │
         └────────┘             └─────────┘            └──────────┘
              ↓                       ↓                       ↓
    ┌─────────────────────────────────────────────────────┐
    │         useExpenses Hook (Expense Logic)             │
    │  - addExpense(data)                                  │
    │  - updateExpense(id, data)                           │
    │  - deleteExpense(id)                                 │
    │  - getExpensesByMonth(month)                         │
    │  - Auto-sync to localStorage                         │
    └─────────────────────────────────────────────────────┘
              ↓                       ↓
    ┌──────────────────────  ┌──────────────────────┐
    │  localStorage: expenses │  localStorage: settings
    │  (JSON array)           │  (JSON object)
    └──────────────────────  └──────────────────────┘

EVENT FLOW (User Action):
┌─────────────────────────────────────────┐
│ User fills form & clicks "Add Expense"  │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│ AddExpenseForm.handleSubmit()            │
│ - Validate input (validation.js)         │
│ - Call context.addExpense()              │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│ ExpenseContext reducer: ADD_EXPENSE      │
│ - Generate ID (timestamp + random)       │
│ - Add to state.expenses array            │
│ - Trigger localStorage sync              │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│ storage.js: saveExpenses()               │
│ - Serialize state to JSON                │
│ - Write to localStorage['...expenses']   │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│ React re-renders:                       │
│ - ExpenseList (new item appears)         │
│ - Dashboard summary (total updated)      │
│ - ChartDisplay (pie chart re-calculates) │
│ - BudgetProgress (updated %)             │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│ User sees changes instantly (<500ms)     │
└─────────────────────────────────────────┘
```

---

## 7. Module Responsibilities & Contracts

### 7.1 Core Modules

#### `utils/storage.js`
**Responsibility:** Synchronous read/write to browser localStorage.
```javascript
// Interface
export const storage = {
  getExpenses(): Expense[],
  setExpenses(expenses: Expense[]): void,
  getSettings(): Settings,
  setSettings(settings: Settings): void,
  getAppState(): AppState,
  setAppState(state: AppState): void,
  clear(): void,  // Full wipe
  export(): { expenses, settings }  // For debug/backup
}
```

#### `utils/calculations.js`
**Responsibility:** Pure functions for expense aggregations (no side effects).
```javascript
export const calculateMonthlyTotal = (expenses, month) => number
export const calculateByCategory = (expenses, month) => { [category]: amount }
export const filterByMonth = (expenses, month) => Expense[]
export const filterByCategory = (expenses, category) => Expense[]
export const filterByMonthAndCategory = (expenses, month, category) => Expense[]
export const validateAmount = (amount) => boolean
export const validateCategory = (category, validCategories) => boolean
```

#### `hooks/useExpenses.js`
**Responsibility:** Encapsulate expense CRUD with localStorage sync.
```javascript
export const useExpenses = () => {
  const [expenses, dispatch] = useReducer(expenseReducer, initialExpenses)
  
  useEffect(() => {
    storage.setExpenses(expenses)  // Sync on change
  }, [expenses])
  
  return {
    expenses,
    addExpense: (data) => dispatch({ type: 'ADD', payload: data }),
    updateExpense: (id, data) => dispatch({ type: 'UPDATE', payload: { id, data } }),
    deleteExpense: (id) => dispatch({ type: 'DELETE', payload: id }),
    getByMonth: (month) => calculations.filterByMonth(expenses, month)
  }
}
```

#### `hooks/useSettings.js`
**Responsibility:** Settings state with localStorage persistence.
```javascript
export const useSettings = () => {
  const [settings, dispatch] = useReducer(settingsReducer, initialSettings)
  
  useEffect(() => {
    storage.setSettings(settings)  // Sync on change
  }, [settings])
  
  return {
    settings,
    updateBudget: (amount) => dispatch({ type: 'SET_BUDGET', payload: amount }),
    addCategory: (name) => dispatch({ type: 'ADD_CATEGORY', payload: name }),
    deleteCategory: (name) => dispatch({ type: 'DELETE_CATEGORY', payload: name }),
    getAllCategories: () => [...settings.categories.preset, ...settings.categories.custom]
  }
}
```

#### `services/ExportService.js`
**Responsibility:** CSV generation and download.
```javascript
export class ExportService {
  static generateCSV(expenses, month = null) => string
  static downloadCSV(csv, filename) => void
  static exportMonthly(expenses, month) => triggers download
  static exportAllTime(expenses) => triggers download
}
```

#### `context/ExpenseContext.jsx`
**Responsibility:** Global expense state via React Context.
```javascript
export const ExpenseContext = createContext()
export const useExpenseContext = () => useContext(ExpenseContext)

// Provides: { expenses, dispatch }
// Actions: ADD_EXPENSE, UPDATE_EXPENSE, DELETE_EXPENSE, LOAD_FROM_STORAGE
```

---

## 8. Performance Strategy (1000+ Expenses)

### 8.1 Optimizations

**Problem:** With 1000 expenses, rendering the full list + chart could be slow.

**Solution Stack:**

| Issue | Solution |
|---|---|
| **List rendering lag** | Implement virtual scrolling (react-window) for expense list. Render only visible items. |
| **Chart re-calculation** | Memoize category totals. Use `useMemo()` for derived data. Calculate only when expenses or month changes. |
| **localStorage sync** | Debounce writes to localStorage (max 1 per 500ms). Batch updates. |
| **Initial load** | Lazy-load app state. Show spinner while localStorage is parsed. |
| **Search/filter lag** | Debounce filter input. Use `useCallback()` for filter handlers. |

### 8.2 Implementation Details

```javascript
// Memoize monthly calculations
const monthlyTotals = useMemo(() => {
  return {
    total: calculations.calculateMonthlyTotal(expenses, selectedMonth),
    byCategory: calculations.calculateByCategory(expenses, selectedMonth)
  }
}, [expenses, selectedMonth])

// Debounce localStorage writes
useEffect(() => {
  const timeout = setTimeout(() => {
    storage.setExpenses(expenses)
  }, 500)
  return () => clearTimeout(timeout)
}, [expenses])

// Virtual scroll for large lists
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={400}
  itemCount={expenses.length}
  itemSize={50}
>
  {({ index, style }) => (
    <div style={style}>
      <ExpenseItem expense={expenses[index]} />
    </div>
  )}
</FixedSizeList>
```

### 8.3 Performance Targets

| Metric | Target | Strategy |
|---|---|---|
| **Initial Load** | <2s | Code-split, lazy load chart library |
| **Add Expense** | <500ms form + <500ms UI update | Debounce localStorage, memoize calculations |
| **Filter/Search** | <200ms | Debounce input, use memo for filters |
| **Chart Render** | <1s | Memoize data, use Recharts responsiveContainer |
| **localStorage Read** | <100ms | Parse once on boot, cache in memory |

**Monitoring:**
- Use React DevTools Profiler to spot re-render waste
- Monitor localStorage size via DevTools
- Test with 5000 expenses before declaring production-ready

---

## 9. Architecture Decision Records (ADRs)

### ADR-001: React Context Over Redux

**Status:** Accepted

**Context:** We need global state management for expenses and settings.

**Decision:** Use React Context + useReducer instead of Redux.

**Rationale:**
- Data shape is simple (flat array of expenses, single settings object)
- Redux boilerplate (actions, reducers, selectors, middleware) is unnecessary overhead
- React 18 Context is optimized for frequent updates
- Easier onboarding for new team members
- Can migrate to Redux later if complexity grows

**Consequences:**
- Context doesn't prevent prop drilling for intermediate components (acceptable; use custom hooks to bypass)
- Context updates cause all subscribers to re-render (mitigated with `useMemo` and component splitting)
- No time-travel debugging (trade-off worth the simplicity)

**Alternatives Considered:**
- Redux (rejected: overkill, boilerplate)
- Zustand (rejected: add dependency, minimal benefit over Context)
- Jotai (rejected: less familiar to team)

---

### ADR-002: localStorage Over IndexedDB

**Status:** Accepted

**Context:** We need persistent, client-side storage for expenses and settings.

**Decision:** Use browser localStorage API instead of IndexedDB.

**Rationale:**
- Simpler synchronous API (no async/promise complexity)
- 5-10 MB quota per domain (sufficient for 5000+ expenses)
- Zero learning curve; built into all browsers
- No abstraction layer needed
- Data is not sensitive (user's own expenses)

**Consequences:**
- Synchronous blocking calls (minimal impact at our scale)
- No support for complex queries (acceptable; we filter in memory)
- Requires manual JSON serialization (handled by `storage.js`)
- Single-tab write conflict (user won't open app in multiple tabs simultaneously)

**Alternatives Considered:**
- IndexedDB (rejected: async complexity, overkill for our data)
- SQLite (WASM) (rejected: adds 500KB bundle size)
- Cloud sync (rejected: privacy requirement, adds backend)

---

### ADR-003: Recharts Over D3/Chart.js

**Status:** Accepted

**Context:** We need responsive, interactive charts for monthly expense visualization.

**Decision:** Use Recharts library for pie and bar charts.

**Rationale:**
- React-native components (no DOM manipulation, plays nice with React)
- Composable API (easy to customize)
- Responsive out-of-the-box
- Small bundle (~60KB gzipped)
- Active maintenance, good docs

**Consequences:**
- Less customization than D3 (acceptable; pie/bar charts meet all requirements)
- Slightly larger bundle than lightweight alternatives (trade-off acceptable)
- Dependency on library updates (mitigated by stable API)

**Alternatives Considered:**
- D3.js (rejected: verbose, steep learning curve, manual SVG manipulation)
- Chart.js (rejected: not React-native, requires wrapper)
- Victory (rejected: overkill for our needs)

---

### ADR-004: CSV Export via Papa Parse, Not Backend

**Status:** Accepted

**Context:** Users need to export expenses to CSV for use in Excel/Sheets.

**Decision:** Generate and download CSV entirely client-side using Papa Parse library.

**Rationale:**
- Zero backend needed (aligns with privacy-first, no server requirement)
- Papa Parse handles edge cases (commas, quotes, newlines in data)
- Instant download, no latency
- User retains full data control
- Simple 3-line integration

**Consequences:**
- Dependency on Papa Parse (lightweight, stable library)
- User browser handles download (works in all modern browsers)
- No server-side logging of exports (acceptable; privacy goal)

**Alternatives Considered:**
- Backend export endpoint (rejected: adds infrastructure, privacy concern)
- Manual array.map() + blob (rejected: fragile, doesn't handle edge cases)
- Google Sheets API (rejected: requires OAuth, adds complexity)

---

### ADR-005: Vite Over Create React App (CRA)

**Status:** Accepted

**Context:** We need a fast build tool and dev server for development velocity.

**Decision:** Use Vite as the build tool instead of Create React App.

**Rationale:**
- 10-100x faster dev server (esbuild-based)
- Instant HMR (hot module reload, <100ms)
- Minimal configuration
- Better TypeScript support (optional but works out of box)
- Production build optimizations (tree-shaking, code-splitting)

**Consequences:**
- Eject from CRA (acceptable; we control our build)
- Slightly different dev environment from production (esbuild vs rollup, acceptable)
- Smaller ecosystem plugins (we don't need many)
- Requires Node 14+ (acceptable for team)

**Alternatives Considered:**
- Create React App (rejected: slow rebuild, inflexible config)
- Next.js (rejected: overkill, adds server complexity)
- Parcel (rejected: Vite is superior for our use case)

---

## 10. Implementation Checklist

### Phase 1: MVP (Weeks 1-2)

- [ ] **Project Setup**
  - [ ] Initialize Vite project (`npm create vite@latest expense-tracker -- --template react`)
  - [ ] Install core deps: React, Recharts, date-fns, Papa Parse, Tailwind
  - [ ] Set up ESLint, Prettier, .gitignore
  - [ ] Create folder structure (src/components, src/hooks, src/utils, etc.)

- [ ] **Foundation**
  - [ ] Implement `utils/storage.js` (get/set localStorage)
  - [ ] Implement `utils/calculations.js` (filter, sum, by-category)
  - [ ] Implement `utils/validation.js` (amount, category, date)
  - [ ] Implement `utils/constants.js` (PRESET_CATEGORIES, DEFAULT_BUDGET)

- [ ] **State Management**
  - [ ] Create `hooks/useExpenses.js` with reducer
  - [ ] Create `hooks/useSettings.js` with reducer
  - [ ] Create `context/ExpenseContext.jsx`
  - [ ] Create `context/SettingsContext.jsx`
  - [ ] Create `context/AppProvider.jsx` (combines all contexts)

- [ ] **Core Components**
  - [ ] `components/Dashboard.jsx` (layout, layout, layout)
  - [ ] `components/AddExpenseForm.jsx` (form modal)
  - [ ] `components/ExpenseList.jsx` (table of recent expenses)
  - [ ] `components/ChartDisplay.jsx` (pie chart via Recharts)
  - [ ] `components/BudgetProgress.jsx` (progress bar)
  - [ ] `components/MonthSelector.jsx` (month nav)
  - [ ] `components/Navbar.jsx` (app title, Settings link)

- [ ] **Reusable UI**
  - [ ] `components/Modal.jsx` (generic modal wrapper)
  - [ ] `components/ConfirmDialog.jsx` (delete confirmation)

- [ ] **Styling**
  - [ ] Configure Tailwind CSS
  - [ ] Style Dashboard layout (grid, flexbox)
  - [ ] Style form inputs and buttons
  - [ ] Ensure mobile responsiveness (breakpoints: sm, md, lg)

- [ ] **Testing (Unit)**
  - [ ] Tests for `calculations.js` (filter, sum by category)
  - [ ] Tests for `validation.js` (amount > 0, category in list, date valid)
  - [ ] Tests for `storage.js` (serialize, deserialize, mock localStorage)

- [ ] **Stories Covered**
  - [x] 1.1 Add Expense
  - [x] 1.2 View Recent Expenses
  - [x] 2.1 View Preset Categories
  - [x] 3.1 Filter by Month
  - [x] 3.2 View Monthly Total
  - [x] 3.3 View Category Breakdown Chart
  - [x] 5.1 Save to localStorage
  - [x] 5.3 Data Recovery (graceful defaults)
  - [x] 7.1 Dashboard Layout
  - [x] 7.2 Add/Edit Form
  - [x] 8.1 Fast Submission (<500ms)
  - [x] 8.2 Instant Chart Updates (<1s)

---

### Phase 2: Enhanced Features (Weeks 3-4)

- [ ] **Expense Management**
  - [ ] Story 1.3: Edit existing expense
  - [ ] Story 1.4: Delete expense with confirmation
  - [ ] Add edit modal to AddExpenseForm
  - [ ] Add delete confirmation to ExpenseList

- [ ] **Category Management**
  - [ ] Story 2.2: Create custom category
  - [ ] Story 2.3: Delete custom category
  - [ ] Create `components/Settings.jsx`
  - [ ] Implement category list with add/delete buttons
  - [ ] Prevent deletion of preset categories
  - [ ] Warn if deleting category with existing expenses

- [ ] **Budget Tracking**
  - [ ] Story 4.1: Set monthly budget
  - [ ] Story 4.2: Display budget progress
  - [ ] Story 4.3: Budget warning alerts
  - [ ] Add budget input to Settings
  - [ ] Update BudgetProgress colors (yellow >80%, red >100%)
  - [ ] Add alert message overlay on Dashboard

- [ ] **Chart Interactivity**
  - [ ] Story 3.4: Click category in chart to filter list
  - [ ] Add onClick handler to Recharts pie chart
  - [ ] Filter ExpenseList by selected category
  - [ ] Add "Clear Filter" button

- [ ] **CSV Export**
  - [ ] Story 6.1: Export current month as CSV
  - [ ] Story 6.2: Export all-time as CSV
  - [ ] Implement `services/ExportService.js`
  - [ ] Add "Export CSV" button to Dashboard
  - [ ] Add export modal with "Current Month" / "All Time" options
  - [ ] Test CSV opens cleanly in Excel and Google Sheets

- [ ] **Settings Screen**
  - [ ] Story 7.3: Settings screen layout
  - [ ] Combine category management + budget into Settings
  - [ ] Add "Back to Dashboard" button
  - [ ] Style Settings with Tailwind

- [ ] **Responsive Design**
  - [ ] Story 7.4: Mobile-responsive layout
  - [ ] Test on 375px (iPhone SE), 768px (iPad), 1200px (desktop)
  - [ ] Touch-friendly buttons (min 48px)
  - [ ] Hide/reflow chart on mobile
  - [ ] Stack components vertically on mobile

- [ ] **Testing (Integration)**
  - [ ] Test add → chart updates → export flow
  - [ ] Test delete → budget recalculates
  - [ ] Test month filter → list and chart change

- [ ] **Stories Covered**
  - [x] 1.3 Edit Expense
  - [x] 1.4 Delete Expense
  - [x] 2.2 Create Custom Category
  - [x] 2.3 Delete Custom Category
  - [x] 3.4 Click Category in Chart
  - [x] 4.1 Set Monthly Budget
  - [x] 4.2 Display Budget Progress
  - [x] 4.3 Budget Warning Alert
  - [x] 6.1 Export Current Month as CSV
  - [x] 6.2 Export All-Time as CSV
  - [x] 7.3 Settings Screen
  - [x] 7.4 Responsive Design

---

### Phase 3: Polish (Week 5)

- [ ] **Performance Optimization**
  - [ ] Implement virtual scrolling for large expense lists (react-window)
  - [ ] Add `useMemo` for monthly totals calculation
  - [ ] Debounce localStorage writes
  - [ ] Profile with React DevTools; identify re-render waste
  - [ ] Test with 1000+ expenses; verify performance targets

- [ ] **Accessibility**
  - [ ] Audit with Axe DevTools
  - [ ] Add aria-labels to buttons and form inputs
  - [ ] Ensure color contrast ratios (WCAG AA)
  - [ ] Test keyboard navigation (Tab, Enter, Escape)

- [ ] **Error Handling**
  - [ ] Handle corrupted localStorage gracefully
  - [ ] Show error toast/banner for failed operations
  - [ ] Add error boundaries (React)
  - [ ] Log errors to console with context

- [ ] **Documentation**
  - [ ] Write README.md (setup, usage, features)
  - [ ] Write DEVELOPMENT.md (local setup, dev commands)
  - [ ] Write API.md (service layer contracts)
  - [ ] Write DEPLOYMENT.md (Netlify build + deploy)

- [ ] **CI/CD**
  - [ ] Set up GitHub Actions workflow
  - [ ] Run tests on PR
  - [ ] Auto-deploy main to Netlify
  - [ ] Add lint + format checks

- [ ] **QA & Testing**
  - [ ] Manual end-to-end tests (add, edit, delete, filter, export)
  - [ ] Test on multiple browsers (Chrome, Safari, Firefox, Edge)
  - [ ] Test on mobile (iOS Safari, Android Chrome)
  - [ ] Test offline (disable network, add expense, reconnect)
  - [ ] Test localStorage quota (fill to ~4MB, verify behavior)

- [ ] **Launch**
  - [ ] Create Netlify site
  - [ ] Configure domain (if applicable)
  - [ ] Set up analytics (optional: Plausible or Fathom)
  - [ ] Write launch blog post / announcement
  - [ ] Share with beta users; collect feedback

---

## 11. Readiness Assessment

### PASS Criteria

- [x] **Architecture is clear and documented** — Component tree, data flow, module contracts all defined
- [x] **Tech stack is justified** — Each choice has rationale and trade-offs documented
- [x] **Data model is finalized** — Expense and Settings schemas agreed upon
- [x] **localStorage strategy is sound** — 5-10 MB quota sufficient for target use case
- [x] **Performance strategy is defined** — Memoization, debouncing, virtual scrolling for 1000+ expenses
- [x] **ADRs address major decisions** — 5 ADRs cover framework, storage, charting, export, build tool
- [x] **Implementation roadmap is clear** — 3 phases, 50+ tasks, stories mapped to deliverables
- [x] **Testing strategy is defined** — Unit tests for utils, integration tests for flows
- [x] **Deployment path is clear** — Vite build → static site → Netlify
- [x] **Team can start development immediately** — Folder structure defined, deps listed, entry points clear

### CONCERNS (Mitigatable)

| Concern | Mitigation |
|---|---|
| localStorage quota at scale (>5K expenses) | Implement export archive feature; users can export old data and clear localStorage |
| Chart performance with 1000+ expenses | Use `useMemo`, test with Recharts `responsiveContainer` responsiveness |
| Mobile form UX (small screens) | Use modal form on mobile; test date picker on iOS/Android |
| Cross-browser localStorage behavior | Test on Chrome, Safari, Firefox; handle private browsing edge cases |
| Accidental data loss (no undo) | Add "Recently Deleted" archive; soft-delete (flag vs true delete) |

### FAIL Criteria (Not Present)

- ❌ **Dependency on unvetted libraries** — All deps are mature and widely used
- ❌ **Lack of error handling** — Error boundaries, validation, and storage fallbacks defined
- ❌ **No offline support** — localStorage ensures full offline capability
- ❌ **Unclear deployment process** — Vite build + Netlify static hosting is straightforward

---

## 12. Deployment & DevOps

### 12.1 Local Development

```bash
# Setup
npm install
npm run dev                 # Start Vite dev server (localhost:5173)

# Build
npm run build              # Vite build → dist/
npm run preview            # Preview production build locally

# Testing
npm run test               # Vitest unit tests
npm run test:ui            # Vitest UI
npm run lint               # ESLint
npm run format             # Prettier
```

### 12.2 Production Deployment (Netlify)

```bash
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[dev]
  command = "npm run dev"
  port = 5173
```

**Deploy Steps:**
1. Push to GitHub (main branch)
2. Netlify auto-detects, runs `npm install && npm run build`
3. Serves `dist/` folder via CDN
4. HTTPS enabled automatically
5. Custom domain: Add A record or use Netlify subdomain

### 12.3 Monitoring

- **Client-side errors:** Sentry (optional, free tier)
- **Performance:** Netlify Analytics or Vercel Analytics
- **Storage usage:** Monitor localStorage via DevTools (manual)

---

## 13. Rollout & Success Metrics

### MVP Success (Phase 1)

- [ ] Users can add expense in <5 seconds
- [ ] Chart updates instantly after adding expense
- [ ] Data persists after page reload
- [ ] App works on mobile (375px width)
- [ ] No console errors

### Enhanced Success (Phase 2)

- [ ] Users can edit and delete expenses
- [ ] Custom categories work
- [ ] Budget progress bar shows and alerts
- [ ] CSV export opens cleanly in Excel
- [ ] Settings persist across sessions

### Polish Success (Phase 3)

- [ ] App handles 1000+ expenses without lag
- [ ] Accessibility audit passes (WCAG AA)
- [ ] CI/CD pipeline auto-deploys
- [ ] Docs are clear and complete
- [ ] Beta users report 4+ star satisfaction

---

## Appendix A: File Template Examples

### `src/hooks/useExpenses.js`
```javascript
import { useReducer, useEffect } from 'react'
import { storage } from '../utils/storage'
import { expenseReducer, initialExpenses } from '../reducers/expenseReducer'

export const useExpenses = () => {
  const [expenses, dispatch] = useReducer(expenseReducer, initialExpenses, (init) => {
    try {
      return storage.getExpenses() || init
    } catch (error) {
      console.error('Failed to load expenses:', error)
      return init
    }
  })

  useEffect(() => {
    storage.setExpenses(expenses)
  }, [expenses])

  return {
    expenses,
    addExpense: (data) => dispatch({ type: 'ADD_EXPENSE', payload: data }),
    updateExpense: (id, data) => dispatch({ type: 'UPDATE_EXPENSE', payload: { id, data } }),
    deleteExpense: (id) => dispatch({ type: 'DELETE_EXPENSE', payload: id })
  }
}
```

### `src/utils/storage.js`
```javascript
const STORAGE_KEY_EXPENSES = 'expense-tracker:expenses'
const STORAGE_KEY_SETTINGS = 'expense-tracker:settings'

export const storage = {
  getExpenses() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_EXPENSES)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Failed to parse expenses:', error)
      return []
    }
  },
  
  setExpenses(expenses) {
    try {
      localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses))
    } catch (error) {
      console.error('Failed to save expenses:', error)
    }
  },
  
  // ... similar for settings
}
```

---

## Appendix B: Dependencies & Versions

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.10.0",
    "date-fns": "^2.30.0",
    "papaparse": "^5.4.1",
    "react-window": "^1.8.10",
    "tailwindcss": "^3.3.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "eslint": "^8.50.0",
    "prettier": "^3.0.0",
    "@tailwindcss/forms": "^0.5.0"
  }
}
```

---

## Appendix C: Environment Assumptions

- **Browser Support:** Chrome 90+, Safari 15+, Firefox 88+, Edge 90+
- **Node.js:** 16+ (for dev and build)
- **Bandwidth:** Works on 3G+ (asset sizes <500KB gzipped)
- **Storage:** localStorage available and not disabled
- **Privacy:** No external APIs or tracking (local-only)

---

## Conclusion

This architecture is **production-ready** and provides a clear path to implementation. The component structure is modular, the data flow is unidirectional and easy to reason about, and the performance strategy handles the target scale (1000+ expenses).

**Key Strengths:**
- Zero backend complexity; full client-side control
- React + Vite provides excellent dev velocity
- localStorage persistence is simple and sufficient
- Responsive design baked in
- Clear ADRs justify all major decisions

**Next Steps:**
1. Set up Vite project ✓
2. Implement storage and utilities layer ✓
3. Build state management (Context + useReducer) ✓
4. Build core components in order of dependency ✓
5. Iterate through phases with user feedback

---

**Architecture Version:** 1.0  
**Status:** ✅ READY FOR IMPLEMENTATION  
**Confidence:** HIGH  
**Estimated Duration:** 5 weeks (1 engineer)  
**Risk Level:** LOW (familiar stack, simple requirements)

