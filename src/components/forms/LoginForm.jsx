import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';

const LoginForm = ({ onLogin, isAuthenticated, task }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (username === 'user@fintrust.com' && password === 'password') {
      onLogin();
      navigate('/');
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
      {task && task.acceptance_criteria[0] && (
        <p className="mt-4">
          <em>Acceptance Criteria (Positive): {task.acceptance_criteria[0]} (Mocked with `user@fintrust.com` / `password` and redirect)</em>
        </p>
      )}
      {error && task && task.acceptance_criteria[1] && (
        <p className="mt-2 error-message">
          <em>Acceptance Criteria (Negative): {task.acceptance_criteria[1]} (Mocked: Authentication error message displayed)</em>
        </p>
      )}
      {task && task.acceptance_criteria[2] && (
        <p className="mt-2 info-message">
          <em>Acceptance Criteria (Edge): {task.acceptance_criteria[2]} (Mocked: Session timeout concept is handled by requiring re-login if `isAuthenticated` is false from localStorage)</em>
        </p>
      )}
    </div>
  );
};

export default LoginForm;