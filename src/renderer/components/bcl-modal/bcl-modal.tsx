import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import './bcl-modal.css';

type BlcModalProps = {
  isShowing: boolean;
  hide: () => void;
};

export const BclModal: React.FC<BlcModalProps> = ({
  isShowing,
  hide,
  children,
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hide();
      }
    };

    if (isShowing) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => window.removeEventListener('keydown', handleEsc);
  }, [isShowing, hide]);

  return isShowing
    ? ReactDOM.createPortal(
        <div className="modal">
          <div className="modal-pop" role="dialog" aria-modal="true">
            {children}
          </div>
          <div
            className="modal-overlay"
            role="none"
            onClick={hide}
            onKeyDown={() => ''}
          />
        </div>,
        document.body
      )
    : null;
};

export default BclModal;
