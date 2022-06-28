import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface Props {
  children: React.ReactNode,
  isOpen: boolean,
}

const Modal: React.FC<Props> = ({ isOpen = false, children }) => {
  const root = React.useRef(document.body as HTMLElement);
  if (!isOpen) {
    return null;
  }
  return ReactDOM.createPortal(
    <div className='Modal-Portal'>
      {children}
    </div>,
    root.current,
  );
};

export default Modal;
