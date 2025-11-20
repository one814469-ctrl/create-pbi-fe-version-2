# FinTrust Loan Application Portal

This project is a dynamically generated React + Vite web application for a "Loan Application Portal",
created based on a structured Agile PBIs (Epics → User Stories → Tasks) and a Product Requirements Document (PRD).

It leverages **shadcn/ui** and **Tailwind CSS** for component styling and a modern, accessible user interface,
adhering to a custom FinTrust brand theme.

## FinTrust Brand & Theme:

*   **Primary:** `#044E7C` (deep teal/blue)
*   **Accent:** `#00A6A6` (teal)
*   **Neutral Dark (Ink):** `#0B2135`
*   **Neutral Muted:** `#6B7C86`
*   **Gold Highlight:** `#D4AF37` (used sparingly for emphasis)
*   **Background:** `#F7FAFB`

The UI features a clean, airy layout with generous white space, card-based content, and a clear visual hierarchy.
It includes a left navigation and top bar suitable for enterprise applications. Dark mode is also supported.

## Features Implemented:

The application dynamically renders features based on the `src/data/epics.json` file. Each top-level
object in this JSON represents an Epic, which corresponds to a navigation link and a dedicated page.
Within each Epic page, User Stories are displayed as feature blocks, and their associated Tasks
are rendered as interactive components or informative displays, all styled with shadcn/ui and the custom theme.

Key functionalities include (mocked for demonstration):

*   **Account Authentication & Access**: Simulated SSO login using `Input` and `Button` components.
*   **Loan Application Submission**: Interactive form with validation, using `Input`, `Select`, `Checkbox`, and `Button`.
*   **Application Status Tracking**: Displays mock application statuses using `Card` and `Badge` components, with themed progress indicators.
*   **Automated Document Verification**: Mock OCR processing and verification status, with UI feedback using `Card` and `Button`.
*   **Credit Check & Scoring Integration**: Simulated credit bureau API calls, results displayed in `Card` with conditional `Badge` for flagging.
*   **Approval Workflow Automation**: Mock automated approval/rejection logic, with `Dialog` for confirmations or `Toast` for notifications.
*   **Internal Loan Management Dashboard**: Search, filter, and audit trail viewing for applications, using `Input`, `Button`, `Table`, and `Card`.
*   **Notifications & Automated Reminders**: Mock notification triggers for applicants and employees, delivered via the `Toast` system.
*   **Reporting & Analytics**: Simulated reports for application volume and customer satisfaction, presented in `Table` and `Card` components.

## How to Run the Project:

1.  **Clone this repository** (or save the files into a new directory).
2.  **Navigate to the project root** in your terminal.
3.  **Install dependencies**:
    ```bash
    npm install
    
4.  **Start the development server**:
    ```bash
    npm run dev
    
    This will typically open the application in your browser at `http://localhost:5173`.

## Project Structure:

*   `public/`: Static assets.
*   `src/`: Application source code.
    *   `assets/`: Image assets.
    *   `components/`: Reusable React components.
        *   `ui/`: **shadcn/ui** primitive components (e.g., `button.jsx`, `card.jsx`, `input.jsx`, `toast.jsx`). These are generated to be self-contained within the project.
        *   `common/`: Generic components like `Header`, `Navigation`.
        *   `tasks/`: Specific components implementing the logic for individual PBI tasks, all using `shadcn/ui` primitives and themed styling.
        *   `EpicPage.jsx`: Renders a page for a given Epic.
        *   `UserStoryBlock.jsx`: Renders a block for a given User Story, containing its tasks.
        *   `DynamicTaskFeature.jsx`: A switcher component that renders the correct task component based on inferred type.
    *   `context/`: React Contexts for global state management (e.g., `AuthContext`, `LoanContext`).
    *   `data/`: Static data, including `epics.json` (the source for all features) and `mockData.js` for simulated backend responses.
    *   `lib/`: Utility functions (e.g., `utils.js` for `clsx` and `tailwind-merge`).
    *   `main.jsx`: Entry point for the React application.
    *   `App.jsx`: Main application component, handles routing and wraps with contexts and `Toaster`.
    *   `index.css`: Global styles, including custom FinTrust theme, Tailwind CSS base, and utility imports.

## Dynamic Content Generation:

The application's structure and interactive elements are built directly from the `src/data/epics.json`.
Modifying this JSON file will automatically update the navigation, pages, and features rendered by the application,
demonstrating the dynamic nature of its generation and how it adapts to changing PBIs.