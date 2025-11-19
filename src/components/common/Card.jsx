import React from 'react';
import '../../styles/App.css'; 

function Card({ children, title, className = '' }) {
  return (
    <div className={`card ${className}`}>
      {title && <h2 className="section-header">{title}</h2>}
      {children}
    </div>
  );
}

export default Card;