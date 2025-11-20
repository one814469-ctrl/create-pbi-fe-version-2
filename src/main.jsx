import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoanProvider } from './context/LoanContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LoanProvider>
          <App />
        </LoanProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);