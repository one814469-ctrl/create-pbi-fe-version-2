import React from 'react';

const Input = ({ id, type = 'text', value, onChange, placeholder, required, name, className = '' }) => {
  return (
    <input
      type={type}
      id={id}
      name={name || id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`form-input ${className}`}
    />
  );
};

export default Input;