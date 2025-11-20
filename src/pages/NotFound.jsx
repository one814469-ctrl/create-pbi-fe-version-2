import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="container">
      <h2 style={{color: '#dc3545'}}>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/"><button>Go to Home</button></Link>
    </div>
  )
}

export default NotFound