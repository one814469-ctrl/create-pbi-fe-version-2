import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
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

    // Acceptance Criteria: Negative - Given I enter incorrect credentials
    if (!username || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    try {
      await login(username, password);
      // Acceptance Criteria: Given I am a registered FinTrust customer...redirected to my dashboard upon success
      displayMessage('success', 'Logged in successfully!');
      navigate('/epics/loan-application-portal'); // Redirect to a default authenticated page
    } catch (error) {
      // Acceptance Criteria: Negative - Then I see an authentication error message and stay on the login page
      setErrorMessage(error.message || 'Authentication failed. Please check your credentials.');
    }
  };

  if (isAuthenticated) {
    return (
      <div>
        <p className="success-message">You are already logged in.</p>
        <button onClick={() => navigate('/epics/loan-application-portal')}>Go to Dashboard</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username">Email:</label>
        <input
          type="email"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="john.doe@fintrust.com"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password123"
          required
        />
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="form-group">
        <button type="submit">Login via FinTrust SSO</button>
      </div>
      <p className="info-message">Hint: Try 'john.doe@fintrust.com' or 'loan.officer@fintrust.com' with password 'password123'</p>
    </form>
  );
};

export default AuthForm;