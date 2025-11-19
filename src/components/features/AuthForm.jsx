import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../common/Notification';
import '../../styles/Form.css';

function AuthForm({ redirectPath = '/epic/loan-application-portal' }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const validate = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required.';
    if (!password) newErrors.password = 'Password is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showNotification('Please correct the errors in the form.', 'error');
      return;
    }

    try {
      const success = await login(username, password);
      if (success) {
        showNotification('Login successful!', 'success');
        navigate(redirectPath);
      } else {
        setErrors({ general: 'Invalid username or password.' });
        showNotification('Invalid username or password.', 'error');
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred.' });
      showNotification('An unexpected error occurred.', 'error');
    }
  };

  return (
    <Card title="FinTrust SSO Login" className="auth-form-card">
      <form onSubmit={handleSubmit} className="form-container">
        <Input
          label="Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
          error={errors.username}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          error={errors.password}
        />
        {errors.general && <p className="form-error-message">{errors.general}</p>}
        <Button type="submit">Log In Securely</Button>
      </form>
      <p className="login-hint">
        Hint: Use `user` for username and `password` for password to log in.
      </p>
    </Card>
  );
}

export default AuthForm;