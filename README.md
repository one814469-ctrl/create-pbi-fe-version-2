# Swan Mauritius Customer Loan Application Portal

This project implements a digital loan application portal based on the provided Product Requirements Document (PRD) and Agile PBIs. It is built with React and Vite, adhering to the Swan Mauritius branding guidelines and using simple HTML, CSS, and JavaScript.

## Features

The application covers the following main epics:

1.  **Customer Loan Application Portal**: Allows applicants to submit loan applications, upload documents, and track status.
2.  **Loan Officer & Underwriter Dashboard**: Provides tools for loan officers to manage, verify, and approve applications.
3.  **Integration & Automation Services**: Simulates automated credit checks and core banking system integration.
4.  **Reporting, Analytics & Compliance**: Presents a mock KPI dashboard and audit trails for compliance.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd swan-mauritius-loan-portal
    
2.  Install dependencies:
    ```bash
    npm install
    # or yarn install
    

### Running the Application

1.  Start the development server:
    ```bash
    npm run dev
    # or yarn dev
    
2.  Open your browser and navigate to the address shown in the terminal (usually `http://localhost:5173`).

## Project Structure

*   `src/main.jsx`: Entry point for the React application.
*   `src/App.jsx`: Main application component, handles routing and global layout.
*   `src/App.css`: Global styles, including Swan Mauritius theme colors and typography.
*   `src/data/epics.json`: Contains the structured PBI data used to generate content.
*   `src/data/mockApplications.js`: Mock data for loan applications.
*   `src/context/`: React context providers for authentication and application data.
*   `src/components/`: Reusable UI components.
*   `src/pages/`: Components representing different application pages (e.g., Loan Application, Dashboard).

## Swan Mauritius Branding

The application adheres to the specified branding guidelines, utilizing the following color palette:

*   `--color-primary: #044E7C`
*   `--color-accent: #00A6A6`
*   `--color-ink: #0B2135`
*   `--color-muted: #6B7C86`
*   `--color-gold: #D4AF37`
*   `--color-bg: #F7FAFB`

The typography is clean, minimal, and elegant, reflecting a corporate style.

## Notes

*   This application uses mock data and simulates backend interactions (e.g., API calls, document verification, notifications) through local state management and console logs.
*   No external UI libraries or frameworks (like Tailwind, Radix, ShadCN) are used, sticking to plain HTML, CSS, and React.
*   All generated code contains no comments, as per requirements.