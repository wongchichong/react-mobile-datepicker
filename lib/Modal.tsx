import { Portal } from 'voby'
import * as React from 'voby'

interface Props {
    children: Child,
    isOpen: boolean,
}

export const Modal = ({ isOpen = false, children }: Props) => {
    const root = typeof window !== 'undefined' ? document.body as HTMLElement : null
    if (!isOpen || !root || !children) {
        return null
    }
    return <Portal>
        <div className='datepicker-modal'>
            {children}
        </div>,
    </Portal>
}

export default Modal
