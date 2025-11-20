import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import CustomerLoanApplication from './pages/CustomerLoanApplication'
import OfficerDashboard from './pages/OfficerDashboard'
import AnalyticsReporting from './pages/AnalyticsReporting'
import NotFound from './pages/NotFound'
import Login from './components/Auth/Login'
import { useAuth } from './context/AuthContext'
import PrivateRoute from './components/Auth/PrivateRoute'

function App() {
  const { user } = useAuth()

  return (
    <>
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/customer" element={<PrivateRoute allowedRoles={['customer']}> <CustomerLoanApplication /> </PrivateRoute>} />
          <Route path="/officer" element={<PrivateRoute allowedRoles={['officer', 'underwriter']}> <OfficerDashboard /> </PrivateRoute>} />
          <Route path="/analyst" element={<PrivateRoute allowedRoles={['analyst']}> <AnalyticsReporting /> </PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App