# Loan Application Portal

This project is a dynamically generated React + Vite web application based on a Product Requirements Document (PRD) and structured Agile PBIs (Epics, User Stories, Tasks). It simulates a customer-facing portal for digital loan applications and an internal dashboard for loan management.

## Features

The application dynamically renders all Epics, User Stories, and Tasks defined in `src/data/epics.json`. Each task is mapped to a mock interactive component or UI element to simulate the intended functionality.

**Key simulated functionalities include:**

*   **Account Authentication:** Mock SSO login.
*   **Loan Application Submission:** Interactive form with basic validation.
*   **Document Upload:** Mock file upload with size/type validation.
*   **Application Status Tracking:** Displays mock application status.
*   **Automated Document Verification:** Simulates OCR data extraction and verification results.
*   **Credit Check Integration:** Mocks API calls to a credit bureau.
*   **Approval Workflow:** Simulates automated approval/rejection logic and compliance checks.
*   **Internal Loan Management Dashboard:** Mock search, filter, and audit trail features.
*   **Notifications & Reminders:** Displays mock notifications for applicants and internal staff.
*   **Reporting & Analytics:** Simple mock graphs and tables for application volume and CSAT.

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

Make sure you have Node.js (which includes npm) installed. You can download it from [nodejs.org](https://nodejs.org/).

### Installation

1.  **Clone this repository** (if it were a real git repo, for this example, you'll create the files directly).
2.  **Navigate to the project directory**:
    ```bash
    cd loan-portal
    
3.  **Install dependencies**:
    ```bash
    npm install
    

### Running the Application

To start the development server:

npm run dev

This will typically open the application in your browser at `http://localhost:5173` (or another port if 5173 is in use).

## Project Structure

*   `public/`: Static assets.
*   `src/`: Main application source code.
    *   `assets/`: Images and other assets.
    *   `components/`: Reusable React components, including specific mock implementations for tasks.
    *   `data/epics.json`: The core PBI data that drives the dynamic rendering.
    *   `pages/`: Components representing different routes/epics.
    *   `App.jsx`: Main application component, handles routing and layout.
    *   `main.jsx`: Entry point for the React application.
    *   `App.css`: Global styles.

## Dynamic Content Generation

The application is designed to be highly dynamic. If you modify `src/data/epics.json`, the navigation, pages, and features will automatically update to reflect the new Epics, User Stories, and Tasks. The `DynamicTaskFeature` component intelligently selects the appropriate mock UI based on keywords in the task descriptions.