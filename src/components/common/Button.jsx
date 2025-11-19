import React from 'react';
import '../../styles/Button.css';

function Button({ children, onClick, type = 'button', variant = 'primary', disabled = false }) {
  const className = `button button-${variant}`;
  return (
    <button type={type} onClick={onClick} className={className} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;