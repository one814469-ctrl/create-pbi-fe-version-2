import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Header() {
  const { isAuthenticated, user, role, logout } = useAuth()

  return (
    <header className="header">
      <h1><Link to="/">Swan Loans</Link></h1>
      <nav className="nav">
        <NavLink to="/" end>Home</NavLink>
        {isAuthenticated && role === 'customer' && (
          <NavLink to="/customer">My Loans</NavLink>
        )}
        {isAuthenticated && (role === 'officer' || role === 'underwriter') && (
          <NavLink to="/officer">Dashboard</NavLink>
        )}
        {isAuthenticated && role === 'analyst' && (
          <NavLink to="/analyst">Reports</NavLink>
        )}
        {!isAuthenticated ? (
          <NavLink to="/login">Login</NavLink>
        ) : (
          <button onClick={logout}>Logout ({user?.name})</button>
        )}
      </nav>
    </header>
  )
}

export default Header