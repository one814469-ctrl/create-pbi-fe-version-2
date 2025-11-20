# FinTrust Loan Application Portal

This project is a dynamically generated React + Vite web application for a "Loan Application Portal",
created based on a structured Agile PBIs (Epics → User Stories → Tasks) and a Product Requirements Document (PRD).

This project uses standard HTML elements, plain CSS, and vanilla JavaScript (with React).
No external UI frameworks like Shadcn UI, Radix UI, or utility-first CSS frameworks like Tailwind CSS are used.
Custom styling is applied via CSS variables to implement the Swan Mauritius brand theme.

## Swan Mauritius Brand & Theme:

*   **Primary:** `#044E7C` (deep teal/blue)
*   **Accent:** `#00A6A6` (teal)
*   **Neutral Dark (Ink):** `#0B2135`
*   **Neutral Muted:** `#6B7C86`
*   **Gold Highlight:** `#D4AF37` (used sparingly for emphasis)
*   **Background:** `#F7FAFB`

The UI features a clean, minimal, and elegant layout with a clear visual hierarchy.
It includes a left navigation and top bar suitable for corporate applications.

## Features Implemented:

The application dynamically renders features based on the `src/data/epics.json` file. Each top-level
object in this JSON represents an Epic, which corresponds to a navigation link and a dedicated page.
Within each Epic page, User Stories are displayed as feature blocks, and their associated Tasks
are rendered as interactive components or informative displays, all styled with the custom theme.

Key functionalities include (mocked for demonstration):

*   **Account Authentication & Access**: Simulated SSO login using basic input fields and buttons.
*   **Loan Application Submission**: Interactive form with validation, using standard HTML form elements.
*   **Application Status Tracking**: Displays mock application statuses using styled divs and custom badges, with themed progress indicators.
*   **Automated Document Verification**: Mock OCR processing and verification status, with UI feedback.
*   **Credit Check & Scoring Integration**: Simulated credit bureau API calls, results displayed with conditional styling for flagging.
*   **Approval Workflow Automation**: Mock automated approval/rejection logic, with simple dialogs/alerts for notifications.
*   **Internal Loan Management Dashboard**: Search, filter, and audit trail viewing for applications, using inputs, buttons, and HTML tables.
*   **Notifications & Automated Reminders**: Mock notification triggers for applicants and employees, delivered via a custom, simple message display system.
*   **Reporting & Analytics**: Simulated reports for application volume and customer satisfaction, presented in HTML tables.

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
        *   `common/`: Generic components like `Header`, `Navigation`, `MessageDisplay` (custom toast system).
        *   `tasks/`: Specific components implementing the logic for individual PBI tasks, all using basic HTML elements and custom CSS.
        *   `EpicPage.jsx`: Renders a page for a given Epic.
        *   `UserStoryBlock.jsx`: Renders a block for a given User Story, containing its tasks.
        *   `DynamicTaskFeature.jsx`: A switcher component that renders the correct task component based on inferred type.
    *   `context/`: React Contexts for global state management (e.g., `AuthContext`, `LoanContext`).
    *   `data/`: Static data, including `epics.json` (the source for all features) and `mockData.js` for simulated backend responses.
    *   `main.jsx`: Entry point for the React application.
    *   `App.jsx`: Main application component, handles routing and wraps with contexts and a custom `MessageDisplay`.
    *   `App.css`: Global styles, including custom Swan Mauritius theme and utility classes.

## Dynamic Content Generation:

The application's structure and interactive elements are built directly from the `src/data/epics.json`.
Modifying this JSON file will automatically update the navigation, pages, and features rendered by the application,
demonstrating the dynamic nature of its generation and how it adapts to changing PBIs.