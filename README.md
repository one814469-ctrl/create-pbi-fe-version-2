# Loan Application Portal

This project is a dynamically generated React application built with Vite, serving as a customer-facing portal for digital loan applications and an internal dashboard for managing them. It implements features based on structured Agile PBIs (Epics, User Stories, Tasks) and a Product Requirements Document (PRD).

## Features

The application dynamically renders Epics as pages, User Stories as feature blocks within those pages, and Tasks as interactive elements or mock functionalities. Key features include:

*   **Account Authentication & Access:** Mock SSO login and user management.
*   **Loan Application Submission:** Forms for personal loan applications and document uploads.
*   **Application Status Tracking:** Real-time status updates for submitted applications.
*   **Automated Document Verification (Mock):** Simulation of OCR data extraction and verification status.
*   **Credit Check & Scoring Integration (Mock):** Simulation of credit bureau API calls and score display.
*   **Approval Workflow Automation (Mock):** Automated decision engine and compliance checks.
*   **Internal Loan Management Dashboard:** Search, filter, and audit trail for loan officers.
*   **Notifications & Automated Reminders (Mock):** Customer status updates and internal task reminders.
*   **Reporting & Analytics (Mock):** Application volume, turnaround times, and customer satisfaction metrics.

## Design System

The UI strictly adheres to a defined brand and theme:

*   **Color Tokens:** `--color-primary`, `--color-accent`, `--color-ink`, `--color-muted`, `--color-gold`, `--color-bg`.
*   **Typography:** Primary font stack `Inter`, with defined headline scales.
*   **Design Tokens:** Spacing scale, `border-radius: 8px`, subtle elevation for cards and modals.
*   **UI Characteristics:** Clean, airy layout, enterprise app structure (left navigation + topbar), clear visual hierarchy, dashboard tiles, and full dark mode support.

## Getting Started

Follow these steps to set up and run the project locally:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd loan-application-portal
    

2.  **Install dependencies:**
    ```bash
    npm install
    

3.  **Run the development server:**
    ```bash
    npm run dev
    

    The application will be accessible at `http://localhost:5173` (or another port if 5173 is in use).

## Project Structure

The project follows a component-based architecture:

*   `src/main.jsx`: Entry point of the React application.
*   `src/App.jsx`: Main application component, sets up routing and theme context.
*   `src/router.jsx`: Defines application routes.
*   `src/styles/`: Contains global CSS variables and styling.
*   `src/contexts/`: React Contexts for authentication and theme management.
*   `src/hooks/`: Custom React hooks.
*   `src/components/layout/`: Layout components like `Sidebar`, `Header`, `Navbar`.
*   `src/components/common/`: Reusable UI components like `Button`, `Input`, `Card`, `Modal`, `Notification`.
*   `src/components/features/`: Specific feature implementations (e.g., `AuthForm`, `LoanApplicationForm`, `DocumentUpload`).
*   `src/pages/`: Page components corresponding to Epics.
*   `src/data/epics.json`: The source of truth for Epics, User Stories, and Tasks.
*   `src/data/mockData.js`: Mock data used to simulate backend responses and application states.
*   `src/utils/api.js`: Utility for simulating API calls.

## How it Works

The application dynamically generates its navigation and content based on the `src/data/epics.json` file. Each Epic corresponds to a navigable page, and within each page, User Stories are rendered as distinct sections containing interactive elements that represent Tasks. Acceptance Criteria are reflected through UI messages, form validations, or simulated behaviors.