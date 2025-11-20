import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Navigation from './components/common/Navigation';
import EpicPage from './components/EpicPage';
import epicsData from './data/epics.json';
import { useAuth } from './context/AuthContext';
import MessageDisplay from './components/common/MessageDisplay';
import { useState } from 'react';

function App() {
  const { isAuthenticated, login, logout } = useAuth();
  const [message, setMessage] = useState(null);

  const displayMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="app-container">
      <Header isAuthenticated={isAuthenticated} onLogout={logout} />
      <div className="main-content">
        <Navigation epics={epicsData} isAuthenticated={isAuthenticated} />
        <div className="page-content">
          {message && <MessageDisplay type={message.type} message={message.text} />}
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
                      login={login}
                      logout={logout}
                      displayMessage={displayMessage}
                    />
                  }
                />
              );
            })}
            <Route path="*" element={<h2>404 - Page Not Found</h2>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;