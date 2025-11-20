import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ displayMessage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username || !password) {
      setErrorMessage('Please enter both username and password.');
      displayMessage('error', 'Login Failed', 'Please enter both username and password.');
      return;
    }

    try {
      await login(username, password);
      displayMessage('success', 'Login Successful', 'You have been logged in successfully!');
      navigate('/epics/loan-application-portal');
    } catch (error) {
      setErrorMessage(error.message || 'Authentication failed. Please check your credentials.');
      displayMessage('error', 'Login Failed', error.message || 'Authentication failed. Please check your credentials.');
    }
  };

  if (isAuthenticated) {
    return (
      <div className="card w-full max-w-md mx-auto">
        <div className="card-header">
          <h3 className="card-title">Already Logged In</h3>
          <p className="card-description">You are already authenticated.</p>
        </div>
        <div className="card-content">
          <p className="success-text mb-4">You are currently logged in.</p>
          <button onClick={() => navigate('/epics/loan-application-portal')}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="card w-full max-w-md mx-auto">
      <div className="card-header">
        <h3 className="card-title">User Login via FinTrust SSO</h3>
        <p className="card-description">Enable customers to log in using FinTrust Bank's Single Sign-On system.</p>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username">Email</label>
            <input
              id="username"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="john.doe@fintrust.com"
              required
              className={errorMessage ? 'error-border' : ''}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password123"
              required
              className={errorMessage ? 'error-border' : ''}
            />
          </div>
          {errorMessage && <p className="error-text text-sm">{errorMessage}</p>}
          <button type="submit" className="w-full">
            Login via FinTrust SSO
          </button>
        </form>
        <p className="text-sm text-muted-foreground mt-4">
          Hint: Try 'john.doe@fintrust.com' or 'loan.officer@fintrust.com' with password 'password123'
        </p>
      </div>
    </div>
  );
};

export default AuthForm;