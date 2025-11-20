import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (username === 'applicant' && password === 'password') {
      login('applicant');
      navigate('/');
    } else if (username === 'officer' && password === 'password') {
      login('officer');
      navigate('/');
    } else if (username === 'compliance' && password === 'password') {
      login('compliance');
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="app-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '50px' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="page-title" style={{ textAlign: 'center' }}>Login</h2>
        {error && <div className="message-error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="applicant, officer, or compliance"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
          </div>
          <div className="form-actions" style={{ justifyContent: 'center' }}>
            <button type="submit">Login</button>
          </div>
        </form>
        <div style={{ marginTop: '1em', textAlign: 'center', fontSize: '0.9em', color: var('--color-muted') }}>
          <p>Use one of these credentials:</p>
          <ul>
            <li>**Applicant:** username: `applicant`, password: `password`</li>
            <li>**Loan Officer:** username: `officer`, password: `password`</li>
            <li>**Compliance Officer:** username: `compliance`, password: `password`</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;