# Hisaab - Expense Sharing App Development Plan

## Overview
Building a mobile-first expense sharing app (Splitwise-style) with React + shadcn-ui
- Theme: Maroon (#800000) primary, White secondary, Light gray background
- Font: Inter, clean and minimal design
- Using dummy/sample data for now, structured for future Supabase integration

## Core Files to Create (Max 8 files)

### 1. **src/App.tsx** - Main app with routing and theme
- Update routing for all main screens
- Apply maroon theme configuration

### 2. **src/pages/Dashboard.tsx** - Main dashboard
- Overview of balances, recent expenses
- Quick add expense button
- Bottom navigation
- Group and individual expense summaries

### 3. **src/pages/AddExpense.tsx** - Add/Edit expense form
- All expense fields (title, amount, date, participants, category, etc.)
- Split method selection (equal, exact amounts, percentages)
- Receipt photo upload placeholder
- Multi-payer support

### 4. **src/pages/Groups.tsx** - Group management
- List all groups
- Create/join group functionality
- Group detail view with expenses and balances

### 5. **src/pages/Balances.tsx** - Balance calculations
- Individual balances (person-to-person)
- Group balances
- Settlement options
- Debt simplification display

### 6. **src/pages/Analytics.tsx** - Charts and reports
- Spending breakdown by category
- Monthly/weekly summaries
- Export functionality (CSV/PDF)
- Pie charts and bar charts

### 7. **src/lib/data.ts** - Sample data and utilities
- Dummy users, groups, expenses, settlements
- Balance calculation functions
- Data models matching the specification

### 8. **src/components/MobileLayout.tsx** - Mobile-first layout component
- Bottom navigation
- Header with app branding
- Mobile-optimized containers

## Key Features to Implement
- ✅ Mobile-first responsive design
- ✅ Expense tracking (individual + group)
- ✅ Balance calculations with debt simplification
- ✅ Manual settlements
- ✅ Group management
- ✅ Multiple split methods
- ✅ Categories and filtering
- ✅ Analytics with charts
- ✅ Export functionality
- ✅ Offline-ready structure (localStorage)
- ✅ Receipt photo placeholders

## Implementation Priority
1. Setup theme and mobile layout
2. Create sample data structure
3. Build dashboard with navigation
4. Implement add expense functionality
5. Create group management
6. Build balance calculations
7. Add analytics and charts
8. Implement export features