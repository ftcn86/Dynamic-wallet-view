# Product Requirements Document: Dynamic Pi Wallet View v2.4
## Application Specification

**Version:** 2.4
**Date:** (Current Date)
**Objective:** To create a comprehensive, user-friendly, and engaging dashboard application for Pi Network users, named "Dynamic Pi Wallet View." This application will provide detailed insights into their Pi holdings, mining activity, team performance, and node operations, while fostering motivation through gamification and community support via donations. It is built with a modern, responsive UI, prioritizing clarity, performance, and a clear path to production integration.

---

## 1. Core User & Value Proposition

*   **Target User:** A representative Pi Network Pioneer (miner, team builder, node operator).
*   **User Need:** To visualize and interact with a single, well-designed interface displaying consolidated Pi-related metrics, tracking progress, managing team insights, and analyzing node performance.
*   **Value Proposition:** Dynamic Pi Wallet View empowers users with better information and engagement tools through a dynamic, insightful, and beautifully designed alternative/enhancement to viewing Pi Network data. *This application is a viewer and insights tool, not a functional wallet for transfers, though it can initiate Pi App payments for specific actions like donations.*

---

## 2. Core Features & Functionality

### 2.1. User Authentication & Onboarding (Mocked/Real)
*   **2.1.1. Login:**
    *   Simulates/Initiates Pi Network authentication via the `piService`.
    *   Display app name "Dynamic Pi Wallet View" and welcome message.
    *   Links to Legal pages (Terms, Privacy).
*   **2.1.2. Terms Acceptance:**
    *   Mandatory review and acceptance of Terms of Service & Privacy Policy post-initial login before accessing the main app.
    *   Option to logout if terms are not accepted.
*   **2.1.3. Session Management:**
    *   Session persistence using `localStorage` to store the user object and preferences. **Must include `typeof window !== 'undefined'` checks to prevent SSR errors.**
*   **2.1.4. Logout:**
    *   Clear user session from `localStorage`.
    *   Confirmation dialog before logout.
    *   Redirect to login page.

### 2.2. Main Dashboard (`/dashboard`)
*   **2.2.1. Key Performance Indicators (KPIs) - Top Section:**
    *   **Total Pi Balance:** Displays user's total Pi. Icon: `Banknote`.
    *   **Current Mining Rate:** Displays current Pi mining rate per hour. Icon: `Gauge`. Clickable, shows AlertDialog prompting to redirect to Pi App mining section (mock URL `pi://mine`).
    *   **Active Team Members:** Displays `active_members / total_members`. Icon: `Users`. Clickable, links to `/dashboard/team`.
    *   **Node Uptime (Conditional):** If `user.isNodeOperator` is true, displays node uptime percentage. Icon: `Server`. Clickable, links to `/dashboard/node`.
*   **2.2.2. Balance Breakdown Card:**
    *   Title: "Balance Breakdown".
    *   Displays data for:
        *   Transferable to Mainnet (Pi amount).
        *   Total Unverified Pi (Pi amount).
        *   Currently in Lockups (Pi amount).
    *   Disclaimer: "Note: Unverified Pi requires associated members to complete KYC to become transferable."
*   **2.2.3. Unverified Pi Detail Card:**
    *   Title: "Unverified Pi Sources". Icon: `ListTree`.
    *   Displays amounts for:
        *   From Referral Team. Icon: `Users`.
        *   From Security Circle. Icon: `Shield`.
        *   From Node Rewards. Icon: `Server`.
        *   From Other Bonuses. Icon: `Gift`.
    *   Disclaimer: "These amounts become transferable as your connections complete KYC or other conditions are met."
*   **2.2.4. Balance Fluctuation Chart Card:**
    *   Title: "Balance Fluctuation".
    *   Chart Type: Bar chart (using Recharts/ShadCN Charts).
    *   Data: Shows historical "Transferable" and "Unverified" Pi amounts.
    *   Time Period Selector: "3M", "6M", "12M" options, changing the displayed chart data.
    *   Y-Axis Label: "Pi Amount".
    *   Tooltip: Show exact values for Transferable and Unverified on hover.
*   **2.2.5. My Badges Card:**
    *   Title: "My Badges".
    *   Displays a grid of user's earned and unearned badges (icons).
    *   Earned badges are full color; unearned are grayscale/dimmed.
    *   Clicking a badge opens a Dialog showing:
        *   Large badge icon.
        *   Badge Name (Title).
        *   Badge Description.
        *   "Earned on: [Date]" (if applicable).
*   **2.2.6. Mining Focus Card:**
    *   Title: "Mining Focus". Icon: `Target`.
    *   Description: "Track your personal mining goals and stay motivated!"
    *   **Weekly Goal:** Progress bar for `active_mining_days_last_week / weekly_mining_target_days`.
    *   **Monthly Goal:** Progress bar for `active_mining_days_last_month / monthly_mining_target_days`.
*   **2.2.7. Team Activity Card:**
    *   Title: "Team Mining Rally". Icon: `Trophy`.
    *   User's personal activity summary.
    *   **Weekly Team Rally Leaderboard (Top 10):** Table showing Rank, Member, Hours.
    *   **Recent Achievements (Badges):** Display ~3 most recently earned badges.
    *   Footer Button: "View Full Team Report" linking to `/dashboard/team`.

### 2.3. Team Insights Page (`/dashboard/team`)
*   **2.3.1. Title:** "Team Insights".
*   **2.3.2. Team Members Table (from data service):**
    *   Columns (all sortable): Member, Join Date, Status, KYC Status, Contribution, Activity.
    *   Loading, error, and empty states.
    *   Sorting logic must be implemented for all specified columns.

### 2.4. Node Analysis Page (`/dashboard/node`)
*   **2.4.1. Title:** "Node Analysis".
*   **2.4.2. Conditional View (based on `user.isNodeOperator`):**
    *   **If Operator:** Show KPIs for "Node Uptime" and "Performance Score", and a "Performance History" line chart.
    *   **If Not Operator:** Show a card encouraging the user to "Become a Node Operator" with a link to the Pi Network site.

### 2.5. User Profile Page (`/dashboard/profile`)
*   **2.5.1. Title:** "Edit Profile".
*   **2.5.2. Form Elements (mock save to `localStorage` user object):**
    *   Profile Picture (with mock upload), Display Name, Bio.
    *   Save Button with loading state and success/error Toast notifications.

### 2.6. Application Settings Page (`/dashboard/settings`)
*   **2.6.1. Title:** "Application Settings".
*   **2.6.2. Theme Selection:** Options for Light, Dark, System. Persists choice to `localStorage` via `next-themes`.
*   **2.6.3. Language Selection has been removed to simplify the application.**

### 2.7. Donation Page (`/dashboard/donate`)
*   **2.7.1. Title:** "Support Dynamic Pi Wallet View".
*   **2.7.2. Content:** A card explaining the value of community support for maintaining and improving the app.
*   **2.7.3. Donation Form:**
    *   An input field for the donation amount (e.g., in Pi).
    *   A "Donate with Pi" button.
*   **2.7.4. Mock Payment Flow:**
    *   Clicking the button will trigger an `AlertDialog` simulating the Pi payment confirmation flow.
    *   The dialog will show the amount and ask for confirmation.
    *   On confirmation, a "Processing..." state will be shown, followed by a success or error Toast notification.

### 2.8. Legal & Informational Pages
*   **2.8.1. Pages:** Terms of Service (`/legal/terms`), Privacy Policy (`/legal/privacy`), Help & Support (`/legal/help`), PiOS License (`/legal/pios-license`).
*   **2.8.2. Layout:** Use a common `LegalPageLayout.tsx` with an Accordion or Markdown display for content.

### 2.9. Sidebar Navigation
*   **2.9.1. Collapsible Design:** Supports expanded and collapsed states.
*   **2.9.2. App Logo/Name:** "Dynamic Pi Wallet View" with `ShieldQuestion` icon.
*   **2.9.3. Navigation Links:**
    *   Dashboard (`LayoutDashboard`)
    *   Team Insights (`Users`)
    *   Node Analysis (`Network`)
    *   **New:** Donate (`Heart`)
    *   Team Chat (`MessageSquare` - with `AlertDialog` confirmation).
*   **2.9.4. User Profile Dropdown Menu:** Triggered by user avatar. Items: Profile, Settings, Help, Legal links, Logout (with confirmation).

---

## 3. Non-Functional Requirements

### 3.1. Pi Platform Integration & Data Abstraction
*   **3.1.1. Hybrid Data Flow:** The application MUST use a central service layer (`src/services/piService.ts`) for all data fetching.
*   **3.1.2. Environment Detection:** This service will contain logic to detect if the app is running within the Pi Browser (e.g., by checking for `window.Pi`).
*   **3.1.3. Real vs. Mock:**
    *   If **in Pi Browser**, the service is designed to make **real Pi SDK calls**. This structure allows for real integration.
    *   If **NOT** in the Pi Browser, it must fall back to using the **mock data** system via the `mockApiCall` utility. This allows for rapid UI development in a standard browser.
*   **3.1.4. SSR Protection:** All code that accesses browser-specific APIs (like `localStorage` or `window`) MUST be protected with checks like `if (typeof window !== 'undefined')` to prevent server-side rendering errors.

### 3.2. Technology Stack & Best Practices
*   **Stack:** Next.js (App Router, latest stable), React (latest stable), TypeScript, ShadCN UI, Tailwind CSS, Lucide React, Recharts.
*   **State Management:** React Context API (`AuthContext`, `ThemeProvider`) with `localStorage` for persistence.
*   **Data Fetching:** All data fetching operations must be channeled through the `piService`. UI components should not directly call `mockApiCall`.
*   **Language:** The application will be **English-only** to simplify development and avoid i18n-related build issues. The multi-language system has been removed.

### 3.3. Performance & Optimization
*   **Image Optimization:** All images must use the `next/image` component.
*   **Lazy Loading:** Pages or large, non-critical components should be loaded dynamically where appropriate.
*   **Memoization:** Components that are expensive to re-render should be wrapped in `React.memo` to prevent unnecessary re-renders.

### 3.4. Accessibility (A11y)
*   **Compliance:** Aim for WCAG 2.1 Level AA compliance.
*   **Requirements:** Must be fully keyboard navigable. All interactive elements must have clear focus states. All images must have meaningful `alt` text. ARIA attributes must be used where semantic HTML is insufficient.

---

## 4. Style Guidelines (Theme - `globals.css` & `tailwind.config.ts`)

*   **Primary Color:** Moderate purple (HSL: `250 60% 60%` / approx. `#735cd6`).
*   **Background Color (Light Theme):** Very light purple (HSL: `250 67% 97%` / approx. `#f2f0fc`).
*   **Background Color (Dark Theme):** Dark desaturated purple (HSL: `250 10% 18%`).
*   **Accent Color:** Muted pink (HSL: `317 54% 64%` / approx. `#d673b8`).
*   **Font:** 'Inter' (sans-serif) for body and headlines. Linked from Google Fonts.
*   **Layout:** Card-based for modularity, using ShadCN `Card` components.

---

## 5. Data Schemas (To be strictly defined in `src/data/schemas.ts`)

*   **User:** id, username, name, avatarUrl, bio, totalBalance, miningRate, isNodeOperator, nodeUptimePercentage, balanceBreakdown (object), unverifiedPiDetails (object), badges (array), activity metrics, termsAccepted (boolean).
*   **Badge:** id, name, description, iconUrl, earned (boolean), earnedDate (string, ISO format), dataAiHint (string, optional).
*   **TeamMember:** id, name, avatarUrl, joinDate, status, unverifiedPiContribution, activity metrics, kycStatus.
*   **NodeData:** nodeId, uptimePercentage, performanceScore, performanceHistory (array of {date, score}).
*   **LegalSection:** title, content.
*   **BalanceChartDataPoint:** date, transferable, unverified.
*   **(New) MockDonation:** A conceptual object for the donation flow, mainly consisting of an amount.

---

## 6. Future Considerations & Roadmap (Out of Scope)

*   Real backend API integration (beyond Pi SDK stubs).
*   Real database integration.
*   Functional Genkit AI features.
*   Real push notifications, email/SMS.
*   Actual financial calculations or market data integration.
