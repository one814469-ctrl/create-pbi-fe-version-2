# FinTrust Loan Application Portal

This project is a dynamically generated React + Vite web application for a "Loan Application Portal",
created based on a structured Agile PBIs (Epics → User Stories → Tasks) and a Product Requirements Document (PRD).

It demonstrates a customer-facing portal for digital loan applications and document submission,
along with mock internal tools for loan management and reporting.

## Features Implemented:

The application dynamically renders features based on the `src/data/epics.json` file. Each top-level
object in this JSON represents an Epic, which corresponds to a navigation link and a dedicated page.
Within each Epic page, User Stories are displayed as feature blocks, and their associated Tasks
are rendered as interactive components or informative displays.

Key functionalities include (mocked for demonstration):

*   **Account Authentication & Access**: Simulated SSO login.
*   **Loan Application Submission**: Interactive form with validation and mock document upload.
*   **Application Status Tracking**: Displays mock application statuses.
*   **Automated Document Verification**: Mock OCR processing and verification status.
*   **Credit Check & Scoring Integration**: Simulated credit bureau API calls.
*   **Approval Workflow Automation**: Mock automated approval/rejection logic.
*   **Internal Loan Management Dashboard**: Search, filter, and audit trail viewing for applications.
*   **Notifications & Automated Reminders**: Mock notification triggers for applicants and employees.
*   **Reporting & Analytics**: Simulated reports for application volume and customer satisfaction.

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
        *   `common/`: Generic components like `Header`, `Navigation`, `MessageDisplay`.
        *   `tasks/`: Specific components implementing the logic for individual PBI tasks (e.g., `AuthForm`, `LoanApplicationForm`, `DocumentUpload`).
        *   `EpicPage.jsx`: Renders a page for a given Epic.
        *   `UserStoryBlock.jsx`: Renders a block for a given User Story, containing its tasks.
        *   `DynamicTaskFeature.jsx`: A switcher component that renders the correct task component based on inferred type.
    *   `context/`: React Contexts for global state management (e.g., `AuthContext`, `LoanContext`).
    *   `data/`: Static data, including `epics.json` (the source for all features) and `mockData.js` for simulated backend responses.
    *   `main.jsx`: Entry point for the React application.
    *   `App.jsx`: Main application component, handles routing.
    *   `App.css`: Global styles.

## Dynamic Content Generation:

The application's structure and interactive elements are built directly from the `src/data/epics.json`.
Modifying this JSON file will automatically update the navigation, pages, and features rendered by the application,
demonstrating the dynamic nature of its generation.