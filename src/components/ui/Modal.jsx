import React from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close-button" aria-label="Close modal">
          &times;
        </button>
        {title && <h5>{title}</h5>}
        <div className="modal-body">
          {children}
        </div>
        {footer && (
          <div className="modal-footer" style={{ marginTop: 'var(--spacing-m)', textAlign: 'right' }}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.getElementById('root') // Render modal outside root app element for better z-index management
  );
};

export default Modal;