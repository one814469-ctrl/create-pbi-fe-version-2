import React from 'react'
import { Link } from 'react-router-dom'
import epics from '../data/epics.json'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">Swan Loans</Link>
        <ul className="nav-links">
          {epics.map((epic) => (
            <li key={epic.route}>
              <Link to={epic.route} className="nav-item">{epic.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar