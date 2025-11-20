import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function HomePage() {
  const { isAuthenticated, role, user } = useAuth()

  return (
    <div className="container">
      <h2>Welcome to Swan Mauritius Loan Portal</h2>
      <p>Your trusted partner for personal and home loans.</p>

      {!isAuthenticated && (
        <div style={{ marginTop: '2em' }}>
          <p>Please <Link to="/login">Login</Link> to access our services.</p>
          <p>
            As a customer, you can apply for loans and track your applications.<br />
            As a loan officer or underwriter, manage applications and make decisions.<br />
            As a business analyst, view performance reports.
          </p>
        </div>
      )}

      {isAuthenticated && (
        <div style={{ marginTop: '2em', textAlign: 'center' }}>
          <h3>Hello, {user?.name}!</h3>
          {role === 'customer' && (
            <div>
              <p>You are logged in as a Customer.</p>
              <Link to="/customer"><button>Go to My Applications</button></Link>
            </div>
          )}
          {(role === 'officer' || role === 'underwriter') && (
            <div>
              <p>You are logged in as a {role === 'officer' ? 'Loan Officer' : 'Underwriter'}.</p>
              <Link to="/officer"><button>Go to Loan Dashboard</button></Link>
            </div>
          )}
          {role === 'analyst' && (
            <div>
              <p>You are logged in as a Business Analyst.</p>
              <Link to="/analyst"><button>View Reports</button></Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default HomePage