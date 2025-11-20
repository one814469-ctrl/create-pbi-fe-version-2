import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isLoggedIn, userRole } = useAuth();

  return (
    <div className="app-main" style={{ textAlign: 'center' }}>
      <h2 className="page-title" style={{ fontSize: '2.5em', marginBottom: '1em' }}>
        Welcome to the Swan Mauritius Loan Application Portal
      </h2>
      <p style={{ fontSize: '1.2em', maxWidth: '800px', margin: '0 auto 2em' }}>
        Your trusted partner for seamless digital loan applications, tracking, and management.
        Experience efficiency and transparency with our innovative platform.
      </p>

      {!isLoggedIn ? (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3>Get Started</h3>
          <p>Login to access your features.</p>
          <div className="form-actions" style={{ justifyContent: 'center' }}>
            <Link to="/login"><button className="button-accent">Login</button></Link>
          </div>
        </div>
      ) : (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3>Your Portal Access</h3>
          {userRole === 'applicant' && (
            <>
              <p>Ready to apply for a loan or check your application status?</p>
              <div className="form-actions" style={{ justifyContent: 'center' }}>
                <Link to="/loan-application-portal"><button>Apply for a Loan</button></Link>
                <Link to="/application-status"><button className="button-secondary">View My Applications</button></Link>
              </div>
            </>
          )}
          {userRole === 'officer' && (
            <>
              <p>Manage loan applications, verify documents, and process approvals.</p>
              <div className="form-actions" style={{ justifyContent: 'center' }}>
                <Link to="/loan-officer-dashboard"><button className="button-accent">Go to Loan Dashboard</button></Link>
              </div>
            </>
          )}
          {userRole === 'compliance' && (
            <>
              <p>Monitor key performance indicators and review audit trails.</p>
              <div className="form-actions" style={{ justifyContent: 'center' }}>
                <Link to="/reporting-analytics"><button className="button-gold">View Analytics Dashboard</button></Link>
              </div>
            </>
          )}
        </div>
      )}

      <div style={{ marginTop: '3em', padding: '2em', backgroundColor: '#e6f7ff', borderRadius: '8px' }}>
        <h3 style={{ color: var('--color-primary') }}>Our Commitment</h3>
        <p style={{ maxWidth: '800px', margin: '0 auto' }}>
          Swan Mauritius is dedicated to providing a secure, efficient, and transparent loan application process.
          We leverage cutting-edge technology to streamline your experience and empower our loan officers.
        </p>
      </div>
    </div>
  );
};

export default HomePage;