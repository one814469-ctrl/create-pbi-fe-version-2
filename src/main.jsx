import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './App.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { ApplicationProvider } from './context/ApplicationContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ApplicationProvider>
        <App />
      </ApplicationProvider>
    </AuthProvider>
  </React.StrictMode>,
);