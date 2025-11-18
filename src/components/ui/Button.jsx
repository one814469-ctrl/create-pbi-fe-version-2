import React from 'react';

const Button = ({ children, variant = 'primary', onClick, disabled, type = 'button', ...props }) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'secondary': return 'button-secondary';
      case 'accent': return 'button-accent';
      case 'danger': return 'button-danger';
      default: return 'button-primary';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`button ${getVariantClass()}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;