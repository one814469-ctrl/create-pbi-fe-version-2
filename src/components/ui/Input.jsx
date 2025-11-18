import React from 'react';

const Input = ({ label, type = 'text', name, value, onChange, onBlur, error, ...props }) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={error ? 'input-error' : ''}
          {...props}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={error ? 'input-error' : ''}
          {...props}
        />
      )}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Input;