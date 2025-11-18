# Smart Loan Processing System (SLPS)

This project is a dynamically generated React application simulating the Smart Loan Processing System for FinTrust Bank, based on a provided Product Requirements Document (PRD) and Agile PBIs (Epics, User Stories, Tasks).

## Project Overview

The SLPS aims to streamline the loan application and approval process by automating document verification, credit scoring, and approval workflows. It includes a customer-facing portal and an internal dashboard for employees.

## Features

The application dynamically renders Epics, User Stories, and Tasks defined in `src/data/epics.json`. Each task is implemented with mock functionality to demonstrate the intended behavior as per the PRD and acceptance criteria.

### Key Sections:

1.  **Loan Application Portal (Customer-facing):** Allows customers to apply for loans online, upload documents, and track application status.
2.  **Automated Document Verification:** Simulates document upload and OCR processing with mock verification outcomes.
3.  **Credit Check Integration:** Demonstrates mock integration with a Credit Bureau API to fetch and display credit scores.
4.  **Notifications and Reporting:** Provides mock automated notifications (email/SMS) and a basic reporting dashboard with key performance indicators.

## Getting Started

Follow these steps to set up and run the project locally:

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or yarn

### Installation

1.  **Clone the repository (if applicable, or create the files as provided):**

    ```bash
    # If you received a zip or direct files, skip this step and navigate to the project root.
    # git clone <repository-url>
    # cd smart-loan-processing-system
    

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    

### Running the Application

1.  **Start the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    

2.  **Open your browser:**
    The application will typically open at `http://localhost:5173` (or another port if 5173 is in use).

## Project Structure

*   `src/main.jsx`: Entry point of the React application.
*   `src/App.jsx`: Main application component, handles routing and layout.
*   `src/App.css`: Global styles.
*   `src/data/epics.json`: Contains the structured Agile PBIs (Epics, User Stories, Tasks) that drive the application's dynamic content.
*   `src/components/`:
    *   `EpicPage.jsx`: Renders a specific Epic, containing its user stories.
    *   `UserStoryBlock.jsx`: Renders a user story, containing its tasks.
    *   `dynamic/DynamicTaskFeature.jsx`: A dynamic component that renders specific task implementations based on the `type` property in `epics.json`.
    *   `task-implementations/`: Folder containing various mock components for different task types (e.g., `FormTask.jsx`, `UploadOcrTask.jsx`, `CreditCheckApiTask.jsx`, etc.).

## How it Works

The application reads the `epics.json` file to dynamically generate navigation, pages, and interactive components. Each Epic corresponds to a navigable route, each User Story is a section on an Epic page, and each Task within a User Story translates into a specific interactive UI element or mock functionality.

This dynamic generation ensures traceability from the PRD to the PBIs and ultimately to the code, making the system adaptable to changes in the backlog.