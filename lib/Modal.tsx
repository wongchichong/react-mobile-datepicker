import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Modal as StyledModal } from './styles';

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
    <StyledModal className='Modal-Portal'>
      {children}
    </StyledModal>,
    root,
  );
};

export default Modal;
