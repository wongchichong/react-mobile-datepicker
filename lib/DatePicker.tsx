/**
 * @module DatePicker Component
 */

import { $, $$, useEffect } from 'voby'

import DatePickerItem from './DatePickerItem'
import {
    DateConfig, dateConfigMap, Theme, Unit,
} from './types'
import { isDateConfig, isDateConfigKey, isTheme } from './utils'
import { convertDate, nextDate } from './utils/time'

export interface DatePickerProps {
    theme?: ObservableMaybe<Theme>,
    value?: ObservableMaybe<Date>,
    min?: ObservableMaybe<Date>,
    max?: ObservableMaybe<Date>,
    customHeader?: Child,
    showHeader?: ObservableMaybe<boolean>,
    showFooter?: ObservableMaybe<boolean>,
    showCaption?: ObservableMaybe<boolean>,
    dateConfig?: ObservableMaybe<Unit[] | DateConfig[]>,
    headerFormat?: ObservableMaybe<string>,
    confirmText?: ObservableMaybe<string>,
    cancelText?: ObservableMaybe<string>,
    onChange?: ObservableMaybe<Function>,
    onSelect?: ObservableMaybe<Function>,
    onCancel?: ObservableMaybe<MouseEventHandler<HTMLButtonElement | HTMLDivElement>>,
}

const normalizeDateConfig = (dateConfig: Required<DatePickerProps>['dateConfig']) => {
    const configList: DateConfig[] = $$(dateConfig).map((value: string | DateConfig) => {
        if (isDateConfigKey(value)) {
            return {
                ...dateConfigMap[value as keyof typeof dateConfigMap],
                type: value,
            }
        }
        if (isDateConfig(value)) {
            const key = value.type
            return {
                ...dateConfigMap[key],
                ...value,
                type: key,
            }
        }
        throw new Error('invalid dateConfig')
    })
    return configList
}

/**
 * Class DatePicker Component Class
 * @extends Component
 */
const DatePicker = ({
    theme = 'default',
    value: propsValue = new Date(),
    min = new Date(1970, 0, 1),
    max = new Date(2050, 0, 1),
    showFooter = true,
    showHeader = true,
    showCaption = false,
    dateConfig = [
        {
            format: 'YYYY',
            caption: 'Year',
            type: 'year',
            step: 1,
        },
        {
            format: 'M',
            caption: 'Mon',
            type: 'month',
            step: 1,
        },
        {
            format: 'D',
            caption: 'Day',
            type: 'date',
            step: 1,
        },
    ],
    headerFormat = 'YYYY/MM/DD',
    confirmText = 'Done',
    cancelText = 'Cancel',
    customHeader,
    onSelect,
    onChange,
    onCancel,
}: DatePickerProps) => {
    const value = $(nextDate($$(propsValue)))
    useEffect(() => {
        value((stateValue) => {
            if (stateValue.getTime() !== $$(propsValue).getTime()) {
                return new Date($$(propsValue))
            }
            return stateValue
        })
    })

    useEffect(() => {
        if (value().getTime() > $$(max).getTime()) {
            value(new Date($$(max)))
        }

        if (value().getTime() < $$(min).getTime()) {
            value(new Date($$(min)))
        }
    })

    const handleFinishBtnClick = () => {
        if (onSelect) $$(onSelect)(value())
    }

    const handleDateSelect = (nextValue: Date) => {
        value(nextValue)
        if (onChange) {
            $$(onChange)($$(nextValue))
        }
    }

    const dataConfigList = normalizeDateConfig(dateConfig)
    return (
        <div
            className={`datepicker ${isTheme(theme) ? theme : 'default'}`}
        >
            {showHeader && (
                <div className='datepicker-header'>
                    {customHeader || convertDate($$(value), $$(headerFormat))}
                </div>
            )}
            {showCaption && (
                <div className='datepicker-caption'>
                    {dataConfigList.map((item, index) => (
                        <div className='datepicker-caption-item'>{item.caption}</div>
                    ))}
                </div>
            )}
            <div className='datepicker-content'>
                {dataConfigList.map((item, index) => (
                    <DatePickerItem
                        value={value}
                        min={min}
                        max={max}
                        step={item.step}
                        type={item.type}
                        format={item.format}
                        onSelect={handleDateSelect} />
                ))}
            </div>
            {showFooter && (
                <div className='datepicker-navbar'>
                    <button
                        className='datepicker-navbar-btn'
                        onClick={handleFinishBtnClick}
                    >
                        {confirmText}
                    </button>
                    <button
                        className='datepicker-navbar-btn'
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                </div>
            )}
        </div>
    )
}


export default DatePicker
