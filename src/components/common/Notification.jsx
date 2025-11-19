import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import '../../styles/Notification.css';

function Notification({ message, type = 'info', duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);

  const handleClose = useCallback(() => {
    setVisible(false);
    if (onClose) {
      setTimeout(onClose, 300); // Allow fade-out animation
    }
  }, [onClose]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(handleClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  if (!visible) return null;

  return ReactDOM.createPortal(
    <div className={`notification notification-${type} ${visible ? 'show' : 'hide'}`}>
      <span>{message}</span>
      <button onClick={handleClose} className="notification-close-button">
        &times;
      </button>
    </div>,
    document.body
  );
}

export default Notification;

export const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    setNotification({ message, type, duration, id: Date.now() });
  }, []);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return {
    notification,
    showNotification,
    clearNotification,
  };
};