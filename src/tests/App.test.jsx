import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from '../App';
import { ToastProvider } from '../components/ui/Toast'; // Ensure ToastProvider is used if App uses useToast

// Mock epics.json data for testing purposes
import epicsData from '../data/epics.json';

// Utility to render component with necessary providers
const renderWithProviders = (component) => {
  return render(
    <Router>
      <ToastProvider>
        {component}
      </ToastProvider>
    </Router>
  );
};

describe('App', () => {
  it('renders the main application title', () => {
    renderWithProviders(<App />);
    expect(screen.getByText(/Smart Loan Processing System/i)).toBeInTheDocument();
  });

  it('renders the Dashboard welcome message by default', () => {
    renderWithProviders(<App />);
    expect(screen.getByText(/Welcome to the SLPS Admin Dashboard!/i)).toBeInTheDocument();
    expect(screen.getByText(/Explore the features by navigating through the Epics in the side menu./i)).toBeInTheDocument();
  });

  it('renders navigation links for all epics from epics.json', () => {
    renderWithProviders(<App />);
    epicsData.forEach(epic => {
      expect(screen.getByRole('link', { name: epic.title })).toBeInTheDocument();
    });
  });

  // Example of a basic route test (more comprehensive route tests would be in router.test.js or e2e)
  it('navigates to an Epic page when a nav link is clicked (mock check)', async () => {
    renderWithProviders(<App />);
    const firstEpicLink = screen.getByRole('link', { name: epicsData[0].title });
    await firstEpicLink.click();
    // After click, the EpicPage for the first epic should be rendered
    expect(screen.getByText(epicsData[0].title)).toBeInTheDocument();
    expect(screen.getByText(epicsData[0].description)).toBeInTheDocument();
  });

  // Test traceability manifest generation (this needs to be a separate Node.js script test)
  // For client-side tests, we can verify the script execution setup, not the file output directly.
});

// A simple test for a UI component
describe('Button component', () => {
  it('renders with primary variant by default', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /Click Me/i });
    expect(button).toHaveClass('button-primary');
  });

  it('renders with secondary variant', () => {
    render(<Button variant="secondary">Click Me</Button>);
    const button = screen.getByRole('button', { name: /Click Me/i });
    expect(button).toHaveClass('button-secondary');
  });
});