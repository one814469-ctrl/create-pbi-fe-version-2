import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import NotificationDisplay from '../NotificationDisplay'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('customer')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { success, role: loggedInRole } = await login(username, password, role)
      if (success) {
        if (loggedInRole === 'customer') {
          navigate('/customer')
        } else if (loggedInRole === 'officer' || loggedInRole === 'underwriter') {
          navigate('/officer')
        } else if (loggedInRole === 'analyst') {
          navigate('/analyst')
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h2>Login to Swan Loan Portal</h2>
      {error && <NotificationDisplay message={error} type="error" />}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Login As:</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)} disabled={loading}>
            <option value="customer">Customer</option>
            <option value="officer">Loan Officer</option>
            <option value="underwriter">Underwriter</option>
            <option value="analyst">Business Analyst</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: '2em', textAlign: 'center' }}>
        <small>Test Credentials:</small><br />
        <small>Customer: `customer` / `password`</small><br />
        <small>Officer: `officer` / `password`</small><br />
        <small>Underwriter: `underwriter` / `password`</small><br />
        <small>Analyst: `analyst` / `password`</small>
      </p>
    </div>
  )
}

export default Login