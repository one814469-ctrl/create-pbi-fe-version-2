# Smart Loan Processing System (SLPS) - Swan Mauritius

This project is an enterprise-grade React application, dynamically generated to simulate the Smart Loan Processing System for FinTrust Bank. It adheres to the provided Product Requirements Document (PRD) and Agile PBIs (Epics, User Stories, Tasks), incorporating a visual theme inspired by Swan Mauritius.

## Features

The application dynamically renders Epics, User Stories, and Tasks defined in `src/data/epics.json`. Each task is implemented with mock functionality to demonstrate the intended behavior, following the specified acceptance criteria and Swan Mauritius visual theme.

### Key Sections:

1.  **Loan Application Portal:** Customer-facing portal for submitting loan requests, uploading documents, and tracking application status.
2.  **Automated Document Verification:** Simulates document upload and OCR processing, including handling verification successes and failures.
3.  **Credit Check Integration:** Demonstrates mock integration with a Credit Bureau API to fetch and display credit scores for internal loan officers.
4.  **Notifications and Reporting:** Provides mock automated notifications (email/SMS) and a basic reporting dashboard with key performance indicators for administrators.

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

### Running Tests

To run unit tests:
npm test
# or
yarn test

### Generating Traceability Manifest

To generate the `traceability.json` file mapping PBIs to code components:
npm run trace
# or
yarn trace
This manifest helps ensure that every backlog item is traceable to a feature in the code, aiding in compliance and project oversight.

## Project Structure

The project is structured to be modular and scalable, reflecting enterprise best practices:

*   `src/main.jsx`: Entry point of the React application.
*   `src/App.jsx`: Main application layout, including header and side navigation.
*   `src/index.css`: Global styles, including Swan Mauritius design tokens (CSS variables).
*   `src/assets/`: Contains static assets like the Swan Mauritius logo.
*   `src/data/epics.json`: The canonical source of Epics, User Stories, and Tasks.
*   `src/lib/api/mockApi.js`: Centralized utility for simulating asynchronous API calls.
*   `src/lib/traceability.js`: Script to generate the `traceability.json` manifest.
*   `src/router.jsx`: Defines the application's routes based on Epics.
*   `src/components/`:
    *   `layout/`: Core layout components (Header, SideNav, Container).
    *   `ui/`: Reusable UI components (Button, Input, Modal, Toast, Table, Form, ProgressTracker, ChartCard).
    *   `EpicPage/`: Components specific to rendering Epics and User Stories.
    *   `dynamic/`: Dynamic component loaders.
    *   `task-implementations/`: Specific mock implementations for each task type.
*   `src/pages/`: Top-level page components (e.g., Dashboard).
*   `src/utils/validation.js`: Utility functions for form and data validation.
*   `src/tests/`: Unit test stubs using Vitest.

This dynamic generation approach ensures traceability from the PRD to the PBIs and ultimately to the code, making the system adaptable to changes in the backlog while maintaining a consistent and professional user experience.