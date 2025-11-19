import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';
import '../../styles/Modal.css';

function Modal({ isOpen, onClose, title, children, footerButtons }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footerButtons && footerButtons.length > 0 && (
          <div className="modal-footer">
            {footerButtons.map((button, index) => (
              <Button
                key={index}
                onClick={button.onClick}
                variant={button.variant || 'primary'}
                disabled={button.disabled}
              >
                {button.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export default Modal;