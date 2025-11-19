import React from 'react';
import '../../styles/Input.css';

function Input({ label, type = 'text', value, onChange, placeholder, required = false, error, name }) {
  return (
    <div className="input-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={error ? 'input-error' : ''}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
}

export default Input;