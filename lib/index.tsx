import * as React from 'react';

import DatePicker, { DatePickerProps } from './DatePicker';
import Modal from './Modal';

interface EnhanceDatePickerProps extends Pick<DatePickerProps, 'onCancel'> {
  isOpen?: boolean,
}

const EnhanceDatePicker: React.FC<EnhanceDatePickerProps> = ({ isOpen = false, onCancel, ...props }) => {
  const onModalClose: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target === event.currentTarget && onCancel) {
      onCancel(event);
    }
  };
  if (!isOpen) {
    return null;
  }
  return (
    <div
      role='presentation'
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

export type { DateConfig } from './dataSource';
export type { ModalDatePickerProps, EnhanceDatePickerProps, DatePickerProps };

export default ModalDatePicker;
