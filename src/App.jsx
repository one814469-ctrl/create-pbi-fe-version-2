import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import epicsData from './data/epics.json';
import EpicPage from './components/EpicPage';
import './App.css';

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Smart Loan Processing System</h1>
        <nav>
          <ul>
            {epicsData.map((epic) => (
              <li key={epic.id}>
                <Link 
                  to={`/epic/${epic.title.toLowerCase().replace(/ /g, '-')}`}
                  className={location.pathname === `/epic/${epic.title.toLowerCase().replace(/ /g, '-')}` ? 'active' : ''}
                >
                  {epic.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="App-main">
        <Routes>
          <Route path="/" element={
            <div className="welcome-message">
              <h2>Welcome to the SLPS Prototype!</h2>
              <p>Explore the features by navigating through the Epics above.</p>
              <p>This application dynamically renders features based on the `epics.json` backlog.</p>
            </div>
          } />
          {epicsData.map((epic) => (
            <Route
              key={epic.id}
              path={`/epic/${epic.title.toLowerCase().replace(/ /g, '-')}`}
              element={<EpicPage epic={epic} />}
            />
          ))}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;