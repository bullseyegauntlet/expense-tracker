# Expense Tracker - User Stories

**Product:** Simple Expense Tracker  
**PRD Version:** v1 (Local, Privacy-First)  
**Total Stories:** 18  
**Last Updated:** 2026-04-17

---

## Epic 1: Core Expense Management

### Story 1.1 - Add Expense
**Title:** User can log a new expense with amount, category, and date

**Description:**  
As a user, I want to add a new expense with basic details so that I can start tracking where my money goes.

**Acceptance Criteria:**
- [ ] User can input an expense amount (required)
- [ ] User can select a category from presets (Food, Transport, Rent, Entertainment, Other)
- [ ] User can set the expense date (defaults to today)
- [ ] User can add an optional note
- [ ] Clicking "Add" validates amount is > 0 and category is selected
- [ ] On success, expense appears in the list and dashboard updates
- [ ] Form clears or closes after successful submission
- [ ] Submit completes in <5 seconds

### Story 1.2 - View Recent Expenses
**Title:** User can see a list of recent expenses on the dashboard

**Description:**  
As a user, I want to see my recent expenses in a list format so that I can quickly review what I've spent.

**Acceptance Criteria:**
- [ ] Dashboard displays a list of the 10 most recent expenses
- [ ] Each expense shows: amount, category, date, note (if any)
- [ ] Expenses are sorted by date (newest first)
- [ ] List updates immediately when a new expense is added
- [ ] List is scrollable if >10 items in current month

### Story 1.3 - Edit Existing Expense
**Title:** User can modify an expense

**Description:**  
As a user, I want to edit an existing expense if I made a mistake or need to correct it.

**Acceptance Criteria:**
- [ ] User can click "Edit" on any expense in the list
- [ ] Edit form pre-populates with current expense data
- [ ] User can change amount, category, date, or note
- [ ] Clicking "Save" validates input (amount > 0, category selected)
- [ ] On success, expense updates in list and dashboard
- [ ] Canceling closes the form without changes

### Story 1.4 - Delete Expense
**Title:** User can remove an expense from their record

**Description:**  
As a user, I want to delete expenses I entered by mistake.

**Acceptance Criteria:**
- [ ] User can click "Delete" on any expense
- [ ] Delete shows a confirmation prompt
- [ ] Confirming deletion removes the expense immediately
- [ ] Canceling keeps the expense
- [ ] Dashboard and charts update after deletion

---

## Epic 2: Category Management

### Story 2.1 - View Preset Categories
**Title:** App provides default expense categories

**Description:**  
As a user, I want preset categories available when adding expenses so I don't have to create everything from scratch.

**Acceptance Criteria:**
- [ ] Default categories exist: Food, Transport, Rent, Entertainment, Other
- [ ] Categories are available in the category dropdown/selector when adding an expense
- [ ] All preset categories are visible and selectable

### Story 2.2 - Create Custom Category
**Title:** User can create a custom expense category

**Description:**  
As a user, I want to add custom categories (e.g., "Utilities", "Groceries") to better organize my spending.

**Acceptance Criteria:**
- [ ] Settings screen has a "Manage Categories" section
- [ ] User can input a new category name
- [ ] Clicking "Add Category" adds it to the list
- [ ] Custom categories appear in the category dropdown when adding expenses
- [ ] Category name cannot be empty or duplicate an existing category
- [ ] Custom category persists across sessions

### Story 2.3 - Delete Custom Category
**Title:** User can remove a custom category

**Description:**  
As a user, I want to delete custom categories I no longer need.

**Acceptance Criteria:**
- [ ] User can click "Delete" next to a custom category in Settings
- [ ] Preset categories (Food, Transport, Rent, Entertainment, Other) cannot be deleted
- [ ] If deleting a category with existing expenses, user sees a warning
- [ ] Deletion removes the category from the dropdown
- [ ] Category persists across sessions

---

## Epic 3: Monthly Reporting & Insights

### Story 3.1 - Filter Expenses by Month
**Title:** User can view expenses for a specific month

**Description:**  
As a user, I want to filter my expenses by month so I can analyze spending patterns month-by-month.

**Acceptance Criteria:**
- [ ] Dashboard has a month/year selector
- [ ] Default view shows current month
- [ ] User can navigate backward/forward through months
- [ ] Clicking a month updates the dashboard and lists (expenses, total, chart)
- [ ] Previously selected month persists while on the page (not across sessions)

### Story 3.2 - View Monthly Total Spent
**Title:** User can see the total amount spent in a given month

**Description:**  
As a user, I want to know my total spending for the selected month at a glance.

**Acceptance Criteria:**
- [ ] Dashboard displays a prominent "Total Spent" figure for the selected month
- [ ] Total recalculates when expenses are added, edited, or deleted
- [ ] Amount updates instantly (no page reload)
- [ ] Format is clear (e.g., "$X,XXX.XX")

### Story 3.3 - View Category Breakdown Chart
**Title:** User can see a visual breakdown of spending by category

**Description:**  
As a user, I want a chart showing how my spending is distributed across categories so I can spot trends.

**Acceptance Criteria:**
- [ ] Dashboard displays a pie or bar chart for the selected month
- [ ] Chart shows all categories with spending in that month
- [ ] Chart includes category name and amount/percentage
- [ ] Chart updates instantly when expenses are added, edited, or deleted
- [ ] Chart is responsive and readable on desktop/tablet
- [ ] Chart title indicates the selected month

### Story 3.4 - View Category Spending Details
**Title:** User can click a category in the chart to see full details

**Description:**  
As a user, I want to drill into a category to see all individual expenses for that category.

**Acceptance Criteria:**
- [ ] Clicking a category in the chart shows a filtered list of expenses for that category
- [ ] Filtered list shows only expenses in the selected month + category
- [ ] User can return to the full list view
- [ ] Each expense in the filtered view can be edited or deleted

---

## Epic 4: Budget Tracking

### Story 4.1 - Set Monthly Budget
**Title:** User can set a monthly budget limit

**Description:**  
As a user, I want to set a budget for each month so I can track if I'm spending within my limits.

**Acceptance Criteria:**
- [ ] Settings screen has a "Monthly Budget" field
- [ ] User can enter a budget amount (required validation: > 0)
- [ ] Clicking "Save" persists the budget across sessions
- [ ] Budget can be changed at any time
- [ ] Budget applies to all months (same limit each month)

### Story 4.2 - Display Budget Progress
**Title:** User can see how much of their budget they've spent

**Description:**  
As a user, I want a visual indicator of my budget progress for the current month.

**Acceptance Criteria:**
- [ ] Dashboard shows a progress bar or gauge labeled "Budget Progress"
- [ ] Progress shows: spent amount / budget limit
- [ ] Progress updates instantly when expenses are added/edited/deleted
- [ ] If no budget is set, progress bar is hidden or shows "No Budget Set"
- [ ] Percentage and remaining amount are displayed clearly

### Story 4.3 - Budget Warning Alert
**Title:** User receives a warning when spending exceeds budget

**Description:**  
As a user, I want an alert when I'm approaching or have exceeded my budget.

**Acceptance Criteria:**
- [ ] When total spending exceeds 80% of budget, progress bar shows warning color (yellow/orange)
- [ ] When total spending exceeds 100% of budget, progress bar shows danger color (red) + alert message
- [ ] Alert message displays: "You've exceeded your budget by $X"
- [ ] Warning clears when spending drops below budget
- [ ] Warning persists on the dashboard until budget is adjusted or expenses are deleted

---

## Epic 5: Data Persistence

### Story 5.1 - Save Expenses to Local Storage
**Title:** App persists all expenses to browser localStorage

**Description:**  
As a user, I want my expenses to be saved automatically so I don't lose data if I close the browser.

**Acceptance Criteria:**
- [ ] When an expense is added, edited, or deleted, data is saved to localStorage
- [ ] Expenses are stored in a structured format (JSON)
- [ ] Only the current browser can access the data (no sync across devices)
- [ ] Closing and reopening the app shows all previous expenses

### Story 5.2 - Save Settings to Local Storage
**Title:** App persists settings (custom categories, budget) to localStorage

**Description:**  
As a user, I want my custom categories and budget settings to persist across sessions.

**Acceptance Criteria:**
- [ ] Custom categories are saved when added
- [ ] Custom categories are restored when the app loads
- [ ] Monthly budget is saved when set
- [ ] Monthly budget is restored when the app loads
- [ ] Deleting the browser's local storage clears all data

### Story 5.3 - Data Recovery / App Initialization
**Title:** App handles missing localStorage gracefully

**Description:**  
As a user, I want the app to start with defaults if localStorage is empty or corrupted.

**Acceptance Criteria:**
- [ ] If localStorage is empty, app shows preset categories and empty expense list
- [ ] If localStorage is corrupted, app warns the user and resets to defaults
- [ ] Preset categories always load even if custom categories fail
- [ ] If budget is missing, it starts as unset

---

## Epic 6: CSV Export

### Story 6.1 - Export Expenses as CSV
**Title:** User can download all expenses for a month as CSV

**Description:**  
As a user, I want to export my expense data to CSV so I can use it in Excel or Sheets.

**Acceptance Criteria:**
- [ ] Dashboard has an "Export CSV" button
- [ ] Clicking export downloads a file named `expenses_YYYY_MM.csv`
- [ ] CSV includes columns: Date, Category, Amount, Note
- [ ] CSV contains all expenses for the selected month
- [ ] CSV opens cleanly in Excel and Google Sheets
- [ ] Amounts are formatted as numbers (not text) in Excel

### Story 6.2 - Export All Expenses
**Title:** User can export all expenses (all time) as CSV

**Description:**  
As a user, I want to optionally export all historical expenses, not just the current month.

**Acceptance Criteria:**
- [ ] Export dialog offers option to "Current Month" or "All Time"
- [ ] Selecting "All Time" exports all expenses from all months
- [ ] File is named `expenses_all_time.csv`
- [ ] CSV structure matches monthly export (Date, Category, Amount, Note)

---

## Epic 7: Dashboard & UI

### Story 7.1 - Dashboard Layout
**Title:** Dashboard presents key information in an intuitive layout

**Description:**  
As a user, I want the dashboard to clearly show my spending summary at a glance.

**Acceptance Criteria:**
- [ ] Dashboard displays in a single-page, responsive layout
- [ ] Key elements are visible on load: month selector, total spent, budget progress, chart
- [ ] Recent expenses list is below the summary section
- [ ] Add/Edit/Delete buttons are easily accessible
- [ ] Settings link is accessible from the top/nav

### Story 7.2 - Add/Edit Expense Form
**Title:** User has a clear form to add or edit expenses

**Description:**  
As a user, I want a simple, fast form to enter expense details.

**Acceptance Criteria:**
- [ ] Form appears in a modal or dedicated panel
- [ ] Form fields are clearly labeled: Amount, Category, Date, Note
- [ ] Amount field only accepts positive numbers
- [ ] Category field is a dropdown (presets + custom)
- [ ] Date field is a date picker (defaults to today)
- [ ] Note field is optional and has a character limit hint
- [ ] Submit button is clearly labeled "Add" or "Save"
- [ ] Cancel button closes the form without saving

### Story 7.3 - Settings Screen
**Title:** User can access and modify settings

**Description:**  
As a user, I want a Settings screen where I can manage categories and budget.

**Acceptance Criteria:**
- [ ] Settings screen is accessible from the main navigation
- [ ] Settings displays two sections: "Manage Categories" and "Monthly Budget"
- [ ] Users can add, delete, and list custom categories
- [ ] Users can view and edit the monthly budget
- [ ] Changes are saved immediately
- [ ] User can return to the dashboard from Settings

### Story 7.4 - Responsive Design
**Title:** App works well on desktop, tablet, and mobile

**Description:**  
As a user, I want the app to be usable on all device sizes.

**Acceptance Criteria:**
- [ ] Layout adapts to screen width (desktop: full, tablet: adjusted, mobile: stacked)
- [ ] Charts are readable on mobile (smaller but visible)
- [ ] Form fields and buttons are touch-friendly on mobile (min 48px)
- [ ] Month selector and navigation work on all devices
- [ ] No horizontal scrolling required on mobile

---

## Epic 8: Performance & Quality

### Story 8.1 - Fast Expense Submission
**Title:** Submitting an expense is fast and responsive

**Description:**  
As a user, I want to add an expense quickly without lag.

**Acceptance Criteria:**
- [ ] From clicking "Add Expense" to form appearing: <500ms
- [ ] From clicking "Submit" to expense appearing in list: <500ms
- [ ] Dashboard chart updates: <1s
- [ ] No page reloads required

### Story 8.2 - Instant Chart Updates
**Title:** Charts update instantly when expenses change

**Description:**  
As a user, I want to see the impact of my entry immediately.

**Acceptance Criteria:**
- [ ] When an expense is added, chart updates within <1s
- [ ] When an expense is edited, chart updates within <1s
- [ ] When an expense is deleted, chart updates within <1s
- [ ] Category breakdown reflects all data accurately
- [ ] Total spent updates instantly

---

## Story Dependencies & Rollout Phases

### Phase 1 (MVP - Core)
- 1.1, 1.2, 2.1, 3.1, 3.2, 5.1, 5.3, 7.1, 7.2, 8.1, 8.2

### Phase 2 (Enhanced)
- 1.3, 1.4, 2.2, 3.3, 3.4, 4.1, 4.2, 4.3, 6.1, 7.3, 7.4

### Phase 3 (Polish)
- 2.3, 5.2, 6.2, (additional QA + styling)

---

## Estimation Notes

- **Phase 1:** ~2-3 weeks (1 engineer)
- **Phase 2:** ~2 weeks
- **Phase 3:** ~1 week
