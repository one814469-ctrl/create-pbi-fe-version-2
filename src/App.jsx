import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Navigation from './components/common/Navigation';
import EpicPage from './pages/EpicPage';
import epicsData from './data/epics.json';
import { useAuth } from './context/AuthContext';
import MessageDisplay from './components/common/MessageDisplay';
import { useState, useEffect } from 'react';

function App() {
  const { isAuthenticated, logout } = useAuth();
  const [message, setMessage] = useState(null);

  const displayMessage = (type, title, description) => {
    setMessage({ type, title, description });
    setTimeout(() => setMessage(null), 5000);
  };

  useEffect(() => {
    let timeoutId;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      if (isAuthenticated) {
        timeoutId = setTimeout(() => {
          logout();
          displayMessage('info', 'Session Expired', 'Your session has timed out due to inactivity. Please log in again.');
        }, 15 * 60 * 1000);
      }
    };

    const handleActivity = () => resetTimer();

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [isAuthenticated, logout, displayMessage]);

  return (
    <div className="app-container">
      <Header isAuthenticated={isAuthenticated} onLogout={logout} />
      <div className="main-layout">
        <Navigation epics={epicsData} isAuthenticated={isAuthenticated} />
        <main className="content-area">
          {message && <MessageDisplay type={message.type} title={message.title} description={message.description} />}
          <Routes>
            <Route path="/" element={<Navigate to="/epics/account-authentication-access" replace />} />
            {epicsData.map((epic) => {
              const slug = epic.title.toLowerCase().replace(/\s+/g, '-');
              return (
                <Route
                  key={epic.title}
                  path={`/epics/${slug}`}
                  element={
                    <EpicPage
                      epic={epic}
                      isAuthenticated={isAuthenticated}
                      displayMessage={displayMessage}
                    />
                  }
                />
              );
            })}
            <Route path="*" element={<h2 className="error-text text-2xl font-bold p-8">404 - Page Not Found</h2>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;