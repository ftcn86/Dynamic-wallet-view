# Best Practices for Working with an Advanced AI Coder

Ted, based on our collaboration, here is an updated guide summarizing the most effective strategies for getting the best possible results from an AI coding assistant. Following these practices will help you build a more complete and accurate application from the start.

---

## 1. The Foundation: A High-Quality PRD

Your most powerful tool is a detailed Product Requirements Document (PRD). Before prompting for any new feature, ensure your PRD is clear and specific.

*   **Be Specific:** Instead of "a dashboard," describe *every single card, chart, and KPI* on the dashboard. Our `docs/prd.md` is a great example of the level of detail required.
*   **Define Scope Clearly:** Explicitly state what is in scope (e.g., "build a frontend application with mock data") and what is out of scope (e.g., "no real backend database integration").
*   **Include Non-Functional Requirements:** Specify the technology stack, accessibility standards (A11y), and performance goals.

**Action:** Always treat the PRD as the ultimate source of truth for *what* to build.

---

## 2. The Power of Iteration and Focused Prompts

While a large initial prompt is good for setup, most development happens iteratively. Avoid vague, broad commands.

| Instead of this (Vague)                               | Do this (Specific & Focused)                                                                                                                                                                                            |
| :---------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Add the dashboard"                                   | "Create the `/dashboard` page. Based on PRD section 2.2, it should have a 2x2 grid of `KPICard` components. Use the `Wallet`, `Gauge`, `Users`, and `Server` icons from Lucide React for the four main KPIs."          |
| "Fix the sidebar"                                     | "The sidebar navigation link for '/dashboard/team' is not highlighting correctly when active. Please review `components/layout/SidebarNavLink.tsx` and ensure the `isActive` logic correctly identifies parent paths." |
| "The data is wrong"                                   | "In `components/dashboard/TeamActivityCard.tsx`, the leaderboard is not sorting correctly by `teamMemberActiveMiningHours_LastWeek` in descending order. Please correct the sorting logic in the component."                |
| "Make it look better on mobile"                       | "Perform a mobile responsiveness sweep. On the dashboard, ensure the KPI grid wraps to 2 columns. On the team page, hide the 'Join Date' and 'KYC Status' columns on screens smaller than `md`."                        |

**Action:** Break down features from the PRD into small, actionable tasks. Prompt the AI to complete one task at a time for the best results.

---

## 3. Context is Everything: "With these files..."

An AI's real power comes from its ability to understand your existing code.

*   **Provide Relevant Files:** When asking for a change, provide the relevant files in the context. If you want a new component to use your `AuthContext`, include `AuthContext.tsx`.
*   **Refer to Specific Code:** You can copy-paste snippets of your code (like a TypeScript interface from `schemas.ts`) directly into the prompt to be explicit.
*   **Example Prompt:** "@components/dashboard/TeamActivityCard.tsx @data/schemas.ts - In the TeamActivityCard, make sure the rendered data for each team member matches the `TeamMember` interface from the schema file."

**Action:** Before prompting, always ask yourself, "What files does the AI need to see to understand this request perfectly?" and provide them.

---

## 4. Master the "Sweep" Command

For enforcing consistency across the entire project, use the concept of a "sweep." This is incredibly powerful for refactoring and cleanup.

*   **Styling Sweep:** "Perform a styling sweep. Find any instances of the CSS class `bg-red-500` and replace it with the correct Tailwind class for our theme's destructive color, `bg-destructive`."
*   **Accessibility Sweep:** "Perform an accessibility sweep. Ensure all `<img>` tags have a meaningful `alt` prop and all icon-only `<button>` elements have an `aria-label` or visible text."
*   **Refactoring Sweep:** "Perform a refactoring sweep. The sorting logic in the Team and Transactions pages is duplicated. Create a single reusable `SortableTableHead` component in `src/components/shared/` and update both pages to use it."

**Action:** Use "sweep" prompts to maintain code quality and consistency as the project grows.

---

## 5. Debugging with the AI

When you encounter bugs, don't just say "it's broken." Provide a structured bug report *to the AI*.

1.  **What I tried to do:** "I clicked the 'Save Profile' button on the `/dashboard/profile` page."
2.  **What I expected to happen:** "I expected to see a 'Profile Saved!' toast notification and for the user's name in the sidebar to update."
3.  **What actually happened:** "The app returned a runtime error `AlertDialogTrigger is not defined`."
4.  **Provide the Code and Error:** Add the relevant component file(s) (e.g., `ProfilePage.tsx`, `AuthContext.tsx`) and the exact error message to the chat context.

**Action:** Treat the AI like a pair programmer. Give it a clear, concise bug report with the error message and relevant code so it can effectively debug the issue.
