import React from 'react';
import ReactDOM from 'react-dom';

import './bcl-modal.css';

type BlcModalProps = {
  isShowing: boolean;
  hide: React.MouseEventHandler<HTMLElement>;
};

export const BclModal: React.FC<BlcModalProps> = ({
  isShowing,
  hide,
  children,
}) => {
  const handleKeyDown = () => {};

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
            onKeyDown={handleKeyDown}
          />
        </div>,
        document.body
      )
    : null;
};

export default BclModal;
