import React from 'react';

const MessageDisplay = ({ type, message }) => {
  if (!message) return null;

  return (
    <div className={`message-box ${type}`}>
      {message}
    </div>
  );
};

export default MessageDisplay;