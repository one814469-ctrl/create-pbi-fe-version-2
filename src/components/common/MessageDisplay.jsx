import React, { useState, useEffect } from 'react';

const MessageDisplay = ({ type, title, description }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
    }, 4500);
    const finalTimer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(finalTimer);
    };
  }, [type, title, description]);

  if (!isVisible) return null;

  return (
    <div className={`message-display ${type} ${isClosing ? 'closing' : ''}`}>
      {title && <div className="message-title">{title}</div>}
      {description && <div className="message-description">{description}</div>}
    </div>
  );
};

export default MessageDisplay;