# Product Requirements Document: Dynamic Pi Wallet View v2.3
## Application Specification

**Version:** 2.3
**Date:** (Current Date)
**Objective:** To create a comprehensive, user-friendly, and engaging dashboard application for Pi Network users, named "Dynamic Pi Wallet View." This application will provide detailed insights into their Pi holdings, mining activity, team performance, and node operations, while fostering motivation through gamification. It will be built with a modern, responsive UI, prioritizing clarity, performance, and internationalization. **This version introduces a hybrid data fetching strategy to support both mock data for UI development and a clear path for real Pi SDK integration for sandbox testing.**

---

## 1. Core User & Value Proposition

*   **Target User:** A representative Pi Network Pioneer (miner, team builder, node operator).
*   **User Need:** To visualize and interact with a single, well-designed interface displaying consolidated Pi-related metrics, tracking progress, managing team insights, and analyzing node performance.
*   **Value Proposition:** Dynamic Pi Wallet View empowers users with better information and engagement tools through a dynamic, insightful, and beautifully designed alternative/enhancement to viewing Pi Network data. *This application is a viewer and insights tool, not a functional wallet, and does not handle real private keys or initiate real transactions.*

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
*   **2.1.3. Session Management (Mocked):**
    *   Simulated session persistence using `localStorage` to store the user object and preferences. **Must include `typeof window !== 'undefined'` checks to prevent SSR errors.**
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
    *   **Weekly Goal (Mocked Data):**
        *   Label: "Weekly Goal (Days)". Icon: `CalendarDays`.
        *   Progress bar showing `active_mining_days_last_week / weekly_mining_target_days`.
        *   Text: `X / Y days`.
        *   Badge: "Goal Achieved!" if met.
        *   Motivational text (e.g., "Keep up the great work!").
    *   **Monthly Goal (Mocked Data):**
        *   Label: "Monthly Goal (Days)". Icon: `CalendarDays`.
        *   Progress bar showing `active_mining_days_last_month / monthly_mining_target_days`.
        *   Text: `X / Y days`.
        *   Badge: "Goal Achieved!" if met.
        *   Motivational text (e.g., "Making great progress!").
    *   Team Encouragement Footer: Text with `Users` icon: "Encourage your team to stay active! Their contributions help the network grow."
*   **2.2.7. Team Activity Card:**
    *   Title: "Team Mining Rally". Icon: `Trophy`.
    *   User's personal activity summary: "Your Activity: X hrs (Last Week), Y hrs (Last Month)".
    *   **Weekly Team Rally Leaderboard (Top 10 from team data):**
        *   Table: Rank, Member (Avatar + Name), Hours.
        *   Highlight user's own row if in Top 10.
        *   If user not in Top 10 but more than 10 members, show user's rank below table.
        *   Handle empty/no activity states.
    *   **Recent Achievements (Badges):**
        *   Title: "Recent Achievements". Icon: `Award`.
        *   Display ~3 most recently earned gamification-related badges from user data (icon + name).
    *   Footer Button: "View Full Team Report" linking to `/dashboard/team`.

### 2.3. Team Insights Page (`/dashboard/team`)
*   **2.3.1. Title:** "Team Insights".
*   **2.3.2. Team Members Table (from data service):**
    *   Columns (all sortable):
        *   Member (Avatar + Name).
        *   Join Date (formatted).
        *   Status (Active, Inactive, Pending - styled badge).
        *   KYC Status ('completed', 'pending', 'not_completed' - styled badge with icon like `ShieldCheck`, `ShieldAlert`, `ShieldX`).
        *   Contribution (Unverified Pi, with tooltip explaining it becomes transferable after KYC).
        *   Activity (Last Week) (hours).
        *   Activity (Last Month) (hours).
    *   Loading state (skeleton rows for visual prototype).
    *   Error state (display message).
    *   Empty state ("You have not invited any team members yet.").
    *   Sorting logic must be implemented for all specified columns.

### 2.4. Node Analysis Page (`/dashboard/node`)
*   **2.4.1. Title:** "Node Analysis".
*   **2.4.2. Conditional View (based on `user.isNodeOperator`):**
    *   **If Operator:**
        *   KPI Card: "Node Uptime" (`XX.XX%`). Icon: `Server`.
        *   KPI Card: "Performance Score" (`XXX`). Icon: `TrendingUp`.
        *   Performance History Chart Card:
            *   Title: "Performance History".
            *   Line chart showing node performance score over time.
            *   Y-Axis Label: "Score".
    *   **If Not Operator:**
        *   Card: "Become a Node Operator". Icon: `Server`.
        *   Description: Encouraging text.
        *   Button: "Learn More on Pi Network Official Site" (links to `PI_NODE_INFO_URL` constant).

### 2.5. User Profile Page (`/dashboard/profile`)
*   **2.5.1. Title:** "Edit Profile".
*   **2.5.2. Form Elements (mock save to `localStorage` user object):**
    *   Profile Picture: Avatar display, file input for image upload (updates mock URL displayed in Avatar, no real upload; use `URL.createObjectURL`).
    *   Display Name (Input field, required).
    *   Bio (Textarea field).
    *   Save Button (with loading state). On click: simulate API call, update user in `AuthContext`, show success/error Toast.
    *   Toast notifications for save success/failure.

### 2.6. Application Settings Page (`/dashboard/settings`)
*   **2.6.1. Title:** "Application Settings".
*   **2.6.2. Theme Selection:**
    *   Label: "Theme".
    *   Options (Buttons or Select): Light, Dark, System. Icons: `Sun`, `Moon`, `Laptop`. Persists choice to `localStorage` via `next-themes` and updates UI immediately.
*   **2.6.3. Language Selection:**
    *   Label: "Language".
    *   Select dropdown with supported languages (English, Spanish, French, Russian, Portuguese, Japanese, Chinese). Persists choice to `localStorage` via `LanguageContext` and updates UI immediately.

### 2.7. Legal & Informational Pages
*   **2.7.1. Terms of Service (`/legal/terms`):** Accordion layout for sections. Content from locale files.
*   **2.7.2. Privacy Policy (`/legal/privacy`):** Accordion layout for sections. Content from locale files.
*   **2.7.3. Help & Support (`/legal/help`):** Accordion layout for sections. Content from locale files.
*   **2.7.4. PiOS License (`/legal/pios-license`):** Markdown display for content from locale files.
*   Common layout component (`LegalPageLayout.tsx`): Card, title, content area, "Return" button (navigates to previous page or login if no user session).

### 2.8. Sidebar Navigation
*   **2.8.1. Collapsible Design:** Supports expanded and collapsed (icon-only) states, responsive for mobile (uses ShadCN `Sheet` or similar for mobile overlay).
*   **2.8.2. App Logo/Name:** App name "Dynamic Pi Wallet View" at the top, with `ShieldQuestion` icon. Links to dashboard.
*   **2.8.3. Navigation Links (use a `SidebarNavLink.tsx` component for consistent styling and active state):**
    *   Dashboard (`LayoutDashboard`)
    *   Team Insights (`Users`)
    *   Node Analysis (`Network`)
    *   Team Chat (`MessageSquare` - opens ShadCN `AlertDialog` confirmation before redirecting to `PI_TEAM_CHAT_URL` constant).
*   **2.8.4. Ad Placeholder:** A visual block for a mock ad at the bottom of the nav links.
*   **2.8.5. User Profile Dropdown Menu (bottom, using ShadCN `DropdownMenu`):**
    *   Trigger: User Avatar, Name, Username.
    *   Items: Profile, Settings, Help, Terms, Privacy, Logout (Logout triggers ShadCN `AlertDialog` for confirmation).

---

## 3. Non-Functional Requirements

### 3.1. Pi Platform Integration & Data Abstraction
*   **3.1.1. App ID Meta Tag:** The root layout (`src/app/layout.tsx`) MUST include the Pi App ID meta tag for future compatibility: `<meta name="pi-app-id" content="dynamic-pi-wallet-view" />`. The value should be an environment variable, falling back to a default.
*   **3.1.2. Pi Browser Detection & SDK Handling:** The application must contain a service layer (`src/services/piService.ts`) responsible for data fetching. This service will:
    *   Contain logic to detect if the app is running within the Pi Browser (e.g., by checking for `window.Pi`).
    *   If in the Pi Browser, it is designed to make **real Pi SDK calls**. This structure allows for real integration.
    *   If **not** in the Pi Browser, it must fall back to using the **mock data** system via the `mockApiCall` utility.
*   **3.1.3. Hybrid Data Flow:** This dual-mode approach allows for rapid UI development with mock data in a standard browser, while enabling real integration testing in the Pi Sandbox without code changes to the UI components themselves.

### 3.2. Technology Stack & Best Practices
*   **Stack:** Next.js (App Router, latest stable), React (latest stable), TypeScript, ShadCN UI, Tailwind CSS, Lucide React, Recharts.
*   **State Management:** React Context API (`AuthContext`, `LanguageContext`, `ThemeProvider`) with `localStorage` for persistence. **Crucially, all `localStorage` access must be wrapped in `if (typeof window !== 'undefined')` checks to prevent SSR errors.**
*   **Data Fetching:** All data fetching operations must be channeled through the `piService` defined in `src/services/piService.ts`. UI components should not directly call `mockApiCall`.

### 3.3. Internationalization (i18n)
*   **Implementation:** All user-facing strings MUST be sourced from locale files (`*.json`) via a `useTranslation` hook. No hardcoded text.
*   **Coverage:** Support for EN, ES, FR, RU, PT, JA, ZH.
*   **Formatting:** Use `toLocaleString` for numbers and `date-fns` for complex date formatting to demonstrate locale awareness.

### 3.4. Performance & Optimization
*   **Image Optimization:** All images must use the `next/image` component.
*   **Lazy Loading:** Pages or large, non-critical components should be loaded dynamically using `React.lazy` and `<Suspense>` with a `LoadingSpinner` fallback to improve initial load times.
*   **Memoization:** Components that are expensive to re-render and receive the same props often should be wrapped in `React.memo` to prevent unnecessary re-renders.
*   **Code Splitting:** Naturally handled by the Next.js App Router.

### 3.5. Accessibility (A11y)
*   **Compliance:** Aim for WCAG 2.1 Level AA compliance.
*   **Requirements:** Must be fully keyboard navigable. All interactive elements must have clear focus states. All images must have meaningful `alt` text. ARIA attributes must be used where semantic HTML is insufficient.

---

## 4. Style Guidelines (Theme - `globals.css` & `tailwind.config.ts`)

*   **Primary Color:** Moderate purple (HSL: `250 60% 60%` / approx. `#735cd6`).
*   **Background Color (Light Theme):** Very light purple (HSL: `250 67% 97%` / approx. `#f2f0fc`).
*   **Background Color (Dark Theme):** Dark desaturated purple (HSL: `250 10% 18%`).
*   **Accent Color:** Muted pink (HSL: `317 54% 64%` / approx. `#d673b8`).
*   **Font:** 'Inter' (sans-serif) for body and headlines. Linked from Google Fonts in `src/app/layout.tsx`.
*   **Layout:** Card-based for modularity, using ShadCN `Card` components.
*   **Visuals:** Simple, minimalist icons from Lucide React. Subtle animations for transitions and loading states (ShadCN defaults are acceptable). Rounded corners (ShadCN default radius: `0.5rem`), shadows for professionalism (ShadCN `Card` default shadow).
*   **Dark Mode:** A well-defined dark theme variant consistent with the primary color palette, configured in `globals.css` using HSL CSS variables.

---

## 5. Data Schemas (To be strictly defined in `src/data/schemas.ts`)

*   **User:** id, username, name, avatarUrl, bio, totalBalance, miningRate, isNodeOperator, nodeUptimePercentage, balanceBreakdown (object: transferableToMainnet, totalUnverifiedPi, currentlyInLockups), unverifiedPiDetails (object: fromReferralTeam, fromSecurityCircle, fromNodeRewards, fromOtherBonuses), badges (array of Badge), userActiveMiningHours_LastWeek, userActiveMiningHours_LastMonth, activeMiningDays_LastWeek, weeklyMiningDaysTarget, activeMiningDays_LastMonth, monthlyMiningDaysTarget, termsAccepted (boolean).
*   **Badge:** id, name, description, iconUrl, earned (boolean), earnedDate (string, ISO format), dataAiHint (string, optional).
*   **TeamMember:** id, name, avatarUrl, joinDate (string, ISO format), status ('active' | 'inactive' | 'pending'), unverifiedPiContribution (number), teamMemberActiveMiningHours_LastWeek (number, optional), teamMemberActiveMiningHours_LastMonth (number, optional), kycStatus ('completed' | 'pending' | 'not_completed', optional).
*   **NodeData:** nodeId, uptimePercentage, performanceScore, performanceHistory (array of {date: string, score: number}).
*   **LegalSection:** title (string), content (string).
*   **BalanceChartDataPoint:** date (string, e.g., 'YYYY-MM-DD'), transferable (number), unverified (number).

---

## 6. Future Considerations & Roadmap

*   Real backend API integration (beyond Pi SDK stubs).
*   Functional Genkit AI features.
*   Real push notifications, email/SMS.
*   Actual financial calculations or market data integration.
*   CI/CD pipelines, Kubernetes, or other DevOps infrastructure.
