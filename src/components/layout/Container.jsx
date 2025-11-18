import React from 'react';

const Container = ({ children }) => {
  return (
    <div className="page-content">
      {children}
    </div>
  );
};

export default Container;