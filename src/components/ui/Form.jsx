import React from 'react';
import Button from './Button';

const Form = ({ onSubmit, children, className = '', ...props }) => {
  return (
    <form onSubmit={onSubmit} className={`form ${className}`} {...props}>
      {children}
    </form>
  );
};

export default Form;