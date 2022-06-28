import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface Props {
  children: React.ReactNode,
  isOpen: boolean,
}

const Modal: React.FC<Props> = ({ isOpen = false, children }) => {
  const root = typeof window !== 'undefined' ? document.body as HTMLElement : null;
  if (!isOpen || !root || !children) {
    return null;
  }
  return ReactDOM.createPortal(
    <div className='Modal-Portal'>
      {children}
    </div>,
    root,
  );
};

export default Modal;
