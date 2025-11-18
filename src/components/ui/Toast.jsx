import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {ReactDOM.createPortal(
        <div className="toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast ${toast.type}`}>
              <span>{toast.message}</span>
              <button onClick={() => removeToast(toast.id)} className="toast-close-button">
                &times;
              </button>
            </div>
          ))}
        </div>,
        document.getElementById('root') // Render toasts outside root app element
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};