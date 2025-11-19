import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';

const HomePage = ({ epics, isAuthenticated }) => {
  const loanApplicationEpic = epics.find(epic => epic.title === "Loan Application Portal");

  return (
    <div className="home-page">
      <h1>Welcome to the FinTrust Loan Application Portal</h1>
      <p>{loanApplicationEpic?.description || "Your trusted partner for digital loan applications."}</p>

      <div className="dashboard-grid mt-4">
        <Card>
          <h3>Apply for a Loan</h3>
          <p>Start your digital loan application today. It's fast, secure, and convenient.</p>
          <Link to="/application">
            <button className="button-primary">Start New Application</button>
          </Link>
        </Card>

        <Card>
          <h3>Track Your Application</h3>
          <p>Already applied? Check the real-time status of your existing loan application.</p>
          <Link to="/status">
            <button className="button-secondary">View Status</button>
          </Link>
        </Card>

        {!isAuthenticated && (
          <Card>
            <h3>Account Access</h3>
            <p>Log in to manage your profile and access your applications.</p>
            <Link to="/login">
              <button className="button-primary">Log In</button>
            </Link>
          </Card>
        )}
      </div>

      <div className="mt-8">
        <h2>About FinTrust Loans</h2>
        <p>
          FinTrust Bank is committed to providing flexible and competitive loan solutions.
          Our digital portal makes the application process seamless, from submission to approval.
          We leverage advanced technology for quick document verification and credit assessment,
          ensuring a smooth experience for all our customers.
        </p>
      </div>
    </div>
  );
};

export default HomePage;