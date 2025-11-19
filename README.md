# FinTrust Loan Application Portal

This project is a dynamically generated React + Vite web application based on a Product Requirements Document (PRD) and structured Agile PBIs (Epics, User Stories, and Tasks). It aims to simulate a customer-facing portal for digital loan applications and an internal dashboard for loan management.

## Features Implemented:

The application dynamically renders features based on the `src/data/epics.json` file. Each Epic corresponds to a page/route, User Stories within an Epic are rendered as feature blocks, and Tasks are interactive elements or mock functionalities.

**Key areas covered:**

*   **Account Authentication & Access:** Mock login functionality.
*   **Loan Application Submission:** Interactive forms for personal loan applications and document uploads.
*   **Application Status Tracking:** Display of application progress.
*   **Automated Document Verification (Mock):** Simulation of OCR data extraction and verification results.
*   **Credit Check & Scoring Integration (Mock):** Simulation of credit checks and display of scores.
*   **Approval Workflow Automation (Mock):** Simulation of automated decision engine and compliance checks.
*   **Internal Loan Management Dashboard:** Mock search, filters, and audit trail for loan officers.
*   **Notifications & Automated Reminders (Mock):** Simulation of customer status updates and internal task reminders.
*   **Reporting & Analytics (Mock):** Mock dashboards for application volume and customer satisfaction.

## How to Run the Project:

1.  **Clone the repository (or save the provided files):**
    If you've received this as a collection of files, ensure they are structured correctly in a directory named `loan-application-portal`.

2.  **Navigate to the project directory:**
    ```bash
    cd loan-application-portal
    

3.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    

4.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    

    This will start the Vite development server, and you can access the application in your browser, usually at `http://localhost:5173`.

## Project Structure:

.
├── public/
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── dashboards/
│   │   │   ├── InternalDashboard.jsx
│   │   │   └── ReportingDashboard.jsx
│   │   ├── forms/
│   │   │   ├── LoanApplicationForm.jsx
│   │   │   └── LoginForm.jsx
│   │   ├── mocks/
│   │   │   ├── ComplianceMock.jsx
│   │   │   ├── CreditCheckMock.jsx
│   │   │   ├── DecisionEngineMock.jsx
│   │   │   ├── NotificationSimulator.jsx
│   │   │   └── OcrExtractionMock.jsx
│   │   ├── status/
│   │   │   └── ApplicationStatusTracker.jsx
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Input.jsx
│   │   ├── DynamicFeature.jsx
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   └── UserStoryBlock.jsx
│   ├── data/
│   │   └── epics.json  <- **The source of all dynamic features**
│   ├── pages/
│   │   ├── ApplicationStatusPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── InternalDashboardPage.jsx
│   │   ├── LoanApplicationPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   └── ReportingPage.jsx
│   ├── App.css
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js

## How Dynamic Generation Works:

1.  **`src/data/epics.json`**: This file contains the entire PBI structure (Epics, User Stories, Tasks, Acceptance Criteria).
2.  **`src/App.jsx`**: Uses `react-router-dom` to set up routes. It loads `epics.json` and passes it to the `Layout` component.
3.  **`src/components/Layout.jsx`**: Renders the `Navbar` and the main content area.
4.  **`src/components/Navbar.jsx`**: Dynamically generates navigation links based on the Epics defined in `epics.json`.
5.  **Page Components (e.g., `LoanApplicationPage.jsx`, `InternalDashboardPage.jsx`):** These pages are mapped to specific Epics. They receive the relevant Epic data.
6.  **`src/components/UserStoryBlock.jsx`**: Renders each User Story's title and description, and then iterates through its Tasks.
7.  **`src/components/DynamicFeature.jsx`**: This is the core component that interprets a Task's title and description to render the appropriate mock UI component (e.g., a form, an uploader, a status tracker, a mock API call button, a report).

This architecture allows for easy extension and modification of features by simply updating the `epics.json` file.

## Acceptance Criteria Implementation Notes:

*   **Validation:** Basic client-side validation is implemented for forms (e.g., required fields).
*   **Confirmation/Error Messages:** Success and error messages are displayed for actions like login, form submission, and file uploads.
*   **Redirection:** Mock authentication redirects are simulated.
*   **Edge/Negative Cases:** These are often represented by specific error messages, conditional rendering (e.g., "No applications found"), or explicit text acknowledging the scenario (e.g., "OCR returned low confidence, manual review needed").

This project serves as a comprehensive demonstration of how a structured PRD and PBIs can be translated into a functional, dynamic React application.