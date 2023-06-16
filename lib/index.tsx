import './index.css'
import { $ } from 'voby'

import DatePicker, { DatePickerProps } from './DatePicker'
import Modal from './Modal'

interface EnhanceDatePickerProps extends Pick<DatePickerProps, 'onCancel'> { isOpen?: boolean, }

const EnhanceDatePicker = ({ isOpen = false, onCancel, ...props }: EnhanceDatePickerProps) => {
    const isModal = $(false)
    const onModalClose: MouseEventHandler<HTMLDivElement> = (event) => {
        if (isModal() && event.target === event.currentTarget && onCancel) {
            isModal(false)
            onCancel(event)
        }
    }
    const handleStart: MouseEventHandler<HTMLDivElement> & TouchEventHandler<HTMLDivElement> = (e) => {
        if (e.target === e.currentTarget && onCancel) {
            isModal(true)
        }
    }
    if (!isOpen) {
        return null
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
    )
}

type ModalDatePickerProps = EnhanceDatePickerProps & DatePickerProps & {
    isPopup?: boolean,
}

const ModalDatePicker = ({ isPopup = true, isOpen = false, ...props }: ModalDatePickerProps) => {
    if (!isPopup) {
        return <DatePicker {...props} />
    }

    return (
        <Modal isOpen={isOpen}>
            <EnhanceDatePicker {...props} isOpen={isOpen} />
        </Modal>
    )
}

ModalDatePicker.displayName = 'MobileDatePicker'

export * from './types'
export type { ModalDatePickerProps, EnhanceDatePickerProps, DatePickerProps }

export default ModalDatePicker
