import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function PrivateRoute({ children, allowedRoles }) {
  const { isAuthenticated, role } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="container">
        <h2 style={{color: '#dc3545'}}>Permission Denied</h2>
        <p>You do not have the necessary permissions to access this page.</p>
        <button onClick={() => window.history.back()}>Go Back</button>
      </div>
    )
  }

  return children
}

export default PrivateRoute