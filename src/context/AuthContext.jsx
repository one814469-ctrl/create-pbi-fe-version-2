import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedRole = localStorage.getItem('role')
    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser))
      setRole(storedRole)
    }
  }, [])

  const login = (username, password, selectedRole) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === 'customer' && password === 'password' && selectedRole === 'customer') {
          const userData = { id: 'cust1', name: 'John Doe', email: 'john@example.com' }
          setUser(userData)
          setRole('customer')
          localStorage.setItem('user', JSON.stringify(userData))
          localStorage.setItem('role', 'customer')
          resolve({ success: true, role: 'customer' })
        } else if (username === 'officer' && password === 'password' && selectedRole === 'officer') {
          const userData = { id: 'off1', name: 'Jane Smith', email: 'jane@example.com' }
          setUser(userData)
          setRole('officer')
          localStorage.setItem('user', JSON.stringify(userData))
          localStorage.setItem('role', 'officer')
          resolve({ success: true, role: 'officer' })
        } else if (username === 'underwriter' && password === 'password' && selectedRole === 'underwriter') {
          const userData = { id: 'und1', name: 'Peter Jones', email: 'peter@example.com' }
          setUser(userData)
          setRole('underwriter')
          localStorage.setItem('user', JSON.stringify(userData))
          localStorage.setItem('role', 'underwriter')
          resolve({ success: true, role: 'underwriter' })
        } else if (username === 'analyst' && password === 'password' && selectedRole === 'analyst') {
          const userData = { id: 'ana1', name: 'Alice Brown', email: 'alice@example.com' }
          setUser(userData)
          setRole('analyst')
          localStorage.setItem('user', JSON.stringify(userData))
          localStorage.setItem('role', 'analyst')
          resolve({ success: true, role: 'analyst' })
        }
        else {
          reject({ success: false, message: 'Invalid credentials or role' })
        }
      }, 500)
    })
  }

  const logout = () => {
    setUser(null)
    setRole(null)
    localStorage.removeItem('user')
    localStorage.removeItem('role')
  }

  const isAuthenticated = !!user
  const isCustomer = role === 'customer'
  const isOfficer = role === 'officer'
  const isUnderwriter = role === 'underwriter'
  const isAnalyst = role === 'analyst'

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, isCustomer, isOfficer, isUnderwriter, isAnalyst, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)