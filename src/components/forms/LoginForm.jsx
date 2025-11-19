import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';

const LoginForm = ({ onLogin, isAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (username === 'user@fintrust.com' && password === 'password') {
      onLogin();
      navigate('/'); // Redirect to home/dashboard on success
    } else {
      setError('Invalid FinTrust SSO credentials. Please try again.');
    }
  };

  if (isAuthenticated) {
    return (
      <div className="login-status">
        <p className="success-message">You are already logged in!</p>
        <Button onClick={() => navigate('/')}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="login-form">
      <h4>User Login via FinTrust SSO</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username (Email)</label>
          <Input
            type="email"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="user@fintrust.com"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <Button type="submit" className="button-primary">Log In via SSO</Button>
      </form>
      <p className="mt-4">
        <em>Acceptance Criteria (Positive): "Given I am a registered FinTrust customer, When I navigate to the loan portal login page, Then I am prompted to authenticate via SSO and redirected to my dashboard upon success" (Mocked with `user@fintrust.com` / `password`)</em>
      </p>
      {error && <p className="mt-2 error-message"><em>Acceptance Criteria (Negative): "Given I enter incorrect credentials, When I attempt to log in, Then I see an authentication error message and stay on the login page" (Mocked)</em></p>}
    </div>
  );
};

export default LoginForm;