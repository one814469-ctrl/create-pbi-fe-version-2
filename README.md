# Swan Mauritius Loan Application Portal

This project implements a digital self-service channel for customers to apply for personal and home loans online, alongside an internal system for loan officers and underwriters.

## Features

**Customer-Facing:**
*   **Loan Application Form Submission:** Submit loan applications for various loan types.
*   **Document Upload & Verification:** Upload supporting documents like ID and income proofs.
*   **Application Status Tracking:** Real-time tracking of application status.

**Internal (Loan Officers/Underwriters):**
*   **Application Queue & Assignment:** View pending applications and assign them for review.
*   **Manual Review and Override:** Manually review flagged applications and override automated decisions.
*   **Credit Check Integration:** Automated fetching and display of applicant credit scores.

**Automated Systems:**
*   **Automated Document Verification (OCR):** Automatic validation of uploaded documents.
*   **Notifications and Reminders:** Automated email/SMS notifications for status updates.
*   **Reporting and Analytics:** Metrics on loan processing times, automation rates, and CSAT.

## Technical Stack

*   **Frontend:** React (SPA)
*   **Build Tool:** Vite
*   **Styling:** Pure CSS (no UI frameworks, no Tailwind)
*   **Routing:** React Router DOM

## Getting Started

Follow these steps to set up and run the project locally:

### 1. Clone the repository

git clone <repository-url>
cd loan-portal-swan-mauritius

### 2. Install Dependencies

Use npm to install all required project dependencies:

npm install

### 3. Run the Development Server

Start the Vite development server:

npm run dev

This will typically open the application in your browser at `http://localhost:5173` (or another available port).

### 4. Build for Production

To create a production-ready build:

npm run build

The build artifacts will be located in the `dist/` directory.

## Branding & Theming

The application adheres to Swan Mauritius branding guidelines, utilizing a specific color palette:

*   `--color-primary: #044E7C`
*   `--color-accent: #00A6A6`
*   `--color-ink: #0B2135`
*   `--color-muted: #6B7C86`
*   `--color-gold: #D4AF37`
*   `--color-bg: #F7FAFB`

Typography is clean, minimal, and elegant, reflecting the corporate style.