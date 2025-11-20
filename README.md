# Swan Mauritius Loan Application Portal

This project implements a digital self-service channel for customers to apply for personal and home loans online, along with an internal system for loan officers and underwriters to manage applications.

The application is built using React and Vite, following the Swan Mauritius branding guidelines.

## Features

*   **Loan Application Portal**:
    *   Application Form Submission
    *   Document Upload & Verification
    *   Application Status Tracking
*   **Loan Management Dashboard**:
    *   Application Queue & Assignment
    *   Manual Review and Override
*   **Automated Document Verification**:
    *   OCR Integration
*   **Credit Check Integration**:
    *   Credit Score Retrieval
*   **Notifications and Reminders**:
    *   Email & SMS Notifications
*   **Reporting and Analytics**:
    *   Loan Processing Reports

## Setup and Run

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd swan-mauritius-loan-portal
    
2.  **Install dependencies**:
    ```bash
    npm install
    
3.  **Start the development server**:
    ```bash
    npm run dev
    
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Project Structure

*   `src/data/epics.json`: Contains the structured PBI data used for dynamic content generation.
*   `src/pages/`: Main route components corresponding to Epics.
*   `src/features/`: Contains specific components implementing User Stories and their Tasks, grouped by feature area.
*   `src/components/`: Reusable UI components like Navbar, Footer, and generic display blocks.
*   `src/App.css`: Global styles and Swan Mauritius theme variables.

## Swan Mauritius Branding

The application adheres to the following color palette:
*   Primary: `#044E7C`
*   Accent: `#00A6A6`
*   Ink: `#0B2135`
*   Muted: `#6B7C86`
*   Gold: `#D4AF37`
*   Background: `#F7FAFB`

Typography is clean, minimal, and elegant.