import './index.css';
import * as React from 'react';

import DatePicker, { DatePickerProps } from './DatePicker';
import Modal from './Modal';

interface EnhanceDatePickerProps extends Pick<DatePickerProps, 'onCancel'> {
  isOpen?: boolean,
}

const EnhanceDatePicker: React.FC<EnhanceDatePickerProps> = ({ isOpen = false, onCancel, ...props }) => {
  const [isModal, setIsModal] = React.useState(false);
  const onModalClose: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (isModal && event.target === event.currentTarget && onCancel) {
      setIsModal(false);
      onCancel(event);
    }
  };
  const handleStart: React.MouseEventHandler<HTMLDivElement> & React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget && onCancel) {
      setIsModal(true);
    }
  };
  if (!isOpen) {
    return null;
  }
  return (
    <div
      role='presentation'
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      onClick={onModalClose}
      className='datepicker-modal'
    >
      <DatePicker {...props} />
    </div>
  );
};

type ModalDatePickerProps = EnhanceDatePickerProps & DatePickerProps & {
  isPopup?: boolean,
};

const ModalDatePicker: React.FC<ModalDatePickerProps> = ({ isPopup = true, isOpen = false, ...props }) => {
  if (!isPopup) {
    return <DatePicker {...props} />;
  }

  return (
    <Modal isOpen={isOpen}>
      <EnhanceDatePicker {...props} isOpen={isOpen} />
    </Modal>
  );
};

ModalDatePicker.displayName = 'MobileDatePicker';

export * from './types';
export type { ModalDatePickerProps, EnhanceDatePickerProps, DatePickerProps };

export default ModalDatePicker;
