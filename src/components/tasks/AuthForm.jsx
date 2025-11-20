import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Already Logged In</CardTitle>
          <CardDescription>You are already authenticated.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-green-600 mb-4">You are currently logged in.</p>
          <Button onClick={() => navigate('/epics/loan-application-portal')}>Go to Dashboard</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>User Login via FinTrust SSO</CardTitle>
        <CardDescription>Enable customers to log in using FinTrust Bank's Single Sign-On system.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Email</Label>
            <Input
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password123"
              required
              className={errorMessage ? 'error-border' : ''}
            />
          </div>
          {errorMessage && <p className="text-destructive text-sm">{errorMessage}</p>}
          <Button type="submit" className="w-full">
            Login via FinTrust SSO
          </Button>
        </form>
        <p className="text-sm text-muted-foreground mt-4">
          Hint: Try 'john.doe@fintrust.com' or 'loan.officer@fintrust.com' with password 'password123'
        </p>
      </CardContent>
    </Card>
  );
};

export default AuthForm;