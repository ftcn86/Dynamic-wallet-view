# Best Practices for Working with Cursor (or any Advanced AI Coder)

Ted, based on our conversations and your goal to get the best possible results from an AI coding assistant like Cursor with minimal rework, here is a guide summarizing the most effective strategies we've discussed. Following these practices will help you get a more complete and accurate application from the start.

---

## 1. The Foundation: Start with a High-Quality PRD

Your most powerful tool is a detailed Product Requirements Document (PRD). Before writing a single prompt, ensure your PRD is as complete as possible.

*   **Be Specific:** Instead of "a dashboard," describe *every single card, chart, and KPI* on the dashboard. Our "Dynamic Pi Wallet View PRD v2.3" is a good example.
*   **Define Scope Clearly:** Explicitly state what is in scope (e.g., "build a frontend application with mock data") and what is out of scope (e.g., "no real backend database integration").
*   **Include Non-Functional Requirements:** Don't forget to specify the technology stack, accessibility standards (A11y), internationalization (i18n) needs, and performance goals.

**Action:** Always provide the latest, most detailed PRD as the primary context for any large-scale generation task.

---

## 2. The "Ultimate Prompt": Your Blueprint for the AI

A single, massive prompt at the beginning can set the entire project on the right course. This prompt translates your PRD into direct, actionable instructions for the AI.

A great "Ultimate Prompt" should include:

*   **Objective:** A clear, one-sentence goal (e.g., "Develop the 'Dynamic Pi Wallet View' application from scratch as a fully functional Next.js frontend application...").
*   **Core Technologies:** List the exact stack and versions if possible (Next.js, TypeScript, ShadCN UI, Tailwind CSS, etc.).
*   **Directory Structure:** Explicitly lay out the entire folder and file structure you expect. This prevents the AI from making its own organizational choices.
*   **Architectural Principles:** Instruct the AI on key patterns to follow:
    *   Use of Server Components vs. Client Components.
    *   State management strategy (React Context, `localStorage` for our application).
    *   How to handle data (e.g., "All data must be fetched via the `piService` which uses mock data for now").
*   **Iterative Implementation Plan:** Tell the AI the *order* in which to build things. This is critical for managing dependencies. For example:
    1.  First, create the data `schemas.ts`.
    2.  Second, create the `mocks.ts` based on the schemas.
    3.  Third, implement the `AuthContext` that uses the mock data.
    4.  Fourth, build the UI components that consume the context.

**Action:** Use the "Ultimate Prompt v2.2" we crafted as a template for starting new, large projects.

---

## 3. The Power of Iteration and Focused Prompts

While the "Ultimate Prompt" is great for setup, most development happens iteratively. Avoid vague, broad commands.

| Instead of this (Vague) | Do this (Specific & Focused) |
| :--- | :--- |
| "Add the dashboard" | "Create the `/dashboard` page. Based on PRD section 2.2, it should have a title and a 2x2 grid of `KPICard` components. Use the `Banknote`, `Gauge`, `Users`, and `Server` icons from Lucide React." |
| "Fix the sidebar" | "The sidebar navigation link for '/dashboard/team' is not highlighting correctly when active. Please review `components/layout/SidebarNavLink.tsx` and ensure the `isActive` logic correctly identifies sub-paths." |
| "The data is wrong" | "In `components/dashboard/TeamActivityCard.tsx`, the leaderboard is not sorting correctly by `teamMemberActiveMiningHours_LastWeek` in descending order. Please correct the sorting logic in the component." |

**Action:** Break down features from the PRD into small, actionable tasks. Prompt Cursor to complete one task at a time.

---

## 4. Context is Everything: "With these files..."

Cursor's real power comes from its ability to understand your existing code.

*   **Provide Relevant Files:** When asking for a change, select the relevant files and add them to the chat context. If you want a new component to use your `AuthContext`, add `AuthContext.tsx` to the chat.
*   **Refer to Specific Code:** You can copy-paste snippets of your code (like a TypeScript interface from `schemas.ts`) directly into the prompt to be explicit.
*   **Example Prompt:** "@components/dashboard/TeamActivityCard.tsx @data/schemas.ts - In the TeamActivityCard, make sure the rendered data for each team member matches the `TeamMember` interface from the schema file."

**Action:** Before prompting, always ask yourself, "What files does the AI need to see to understand this request perfectly?" and add them to the context.

---

## 5. Master the "Sweep" Command

For enforcing consistency across the entire project, use the concept of a "sweep." This is incredibly powerful for refactoring and cleanup.

*   **i18n Sweep:** "Perform an i18n sweep. Check all `.tsx` files in `src/app` and `src/components` for any hardcoded user-facing strings. Replace them with calls to the `t()` function from our `useTranslation` hook and add the new keys to `locales/en.json`."
*   **Styling Sweep:** "Perform a styling sweep. Find any instances of the CSS class `bg-red-500` and replace it with the correct Tailwind class for our theme's destructive color, `bg-destructive`."
*   **Accessibility Sweep:** "Perform an accessibility sweep. Ensure all `<img>` tags have a meaningful `alt` prop and all icon-only `<button>` elements have an `aria-label`."

**Action:** Use "sweep" prompts to maintain code quality and consistency as the project grows.

---

## 6. Debugging with the AI

When you encounter bugs, don't just say "it's broken." Provide a structured bug report *to the AI*.

1.  **What I tried to do:** "I clicked the 'Save Profile' button on the `/dashboard/profile` page."
2.  **What I expected to happen:** "I expected to see a 'Profile Saved!' toast notification and for the user's name in the sidebar to update."
3.  **What actually happened:** "The app crashed, and I saw this error in the browser console: `TypeError: Cannot read properties of null (reading 'name')`."
4.  **Provide the Code:** Add the relevant component file(s) (e.g., `ProfilePage.tsx`, `AuthContext.tsx`) to the chat context.

**Action:** Treat the AI like a pair programmer. Give it a clear, concise bug report with the error message and relevant code so it can effectively debug the issue.
