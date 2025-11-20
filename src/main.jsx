import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Custom themed CSS with Tailwind & Shadcn setup
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoanProvider } from './context/LoanContext';
import { Toaster } from '@/components/ui/toaster'; // Shadcn Toaster

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LoanProvider>
          <App />
          <Toaster /> {/* Place Toaster at the root of the app */}
        </LoanProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);