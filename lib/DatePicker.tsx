/**
 * @module DatePicker Component
 */

import React, { useEffect, useState } from 'react';

import { DateConfig, dateConfigMap } from './dataSource';
import DatePickerItem from './DatePickerItem';
import { convertDate, nextDate, Unit } from './time';

export interface DatePickerProps {
  theme?: string,
  value?: Date,
  min?: Date,
  max?: Date,
  customHeader?: React.ReactNode,
  showHeader?: boolean,
  showFooter?: boolean,
  showCaption?: boolean,
  dateConfig?: Unit[] | DateConfig[],
  headerFormat?: string,
  confirmText?: string,
  cancelText?: string,
  onChange?: Function,
  onSelect?: Function,
  onCancel?: React.MouseEventHandler<HTMLButtonElement | HTMLDivElement>,
}

const isString = (val: any): val is keyof typeof dateConfigMap => !!dateConfigMap.hasOwnProperty(val);

const normalizeDateConfig = (dateConfig: Required<DatePickerProps>['dateConfig']) => {
  const configList: DateConfig[] = dateConfig.map((value: string | DateConfig) => {
    if (isString(value)) {
      return {
        ...dateConfigMap[value as keyof typeof dateConfigMap],
        type: value,
      };
    }
    if (typeof value === 'object') {
      const key = value.type;
      if (isString(key)) {
        return {
          ...dateConfigMap[key],
          ...value,
          type: key,
        };
      }
    }
    throw new Error('invalid dateConfig');
  });
  return configList;
};

/**
 * Class DatePicker Component Class
 * @extends Component
 */
const DatePicker: React.FC<DatePickerProps> = ({
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
      step: 1,
    },
  ] as DateConfig[],
  headerFormat = 'YYYY/MM/DD',
  confirmText = 'Done',
  cancelText = 'Cancel',
  customHeader,
  onSelect,
  onChange,
  onCancel,
}) => {
  const [value, setValue] = useState(nextDate(propsValue));
  useEffect(() => {
    setValue((stateValue) => {
      if (stateValue.getTime() !== propsValue.getTime()) {
        return new Date(propsValue);
      }
      return stateValue;
    });
  }, [propsValue]);

  useEffect(() => {
    if (value.getTime() > max.getTime()) {
      setValue(new Date(max));
    }

    if (value.getTime() < min.getTime()) {
      setValue(new Date(min));
    }
  }, [value, min, max]);

  const handleFinishBtnClick = () => {
    if (onSelect) onSelect(value);
  };

  const handleDateSelect = (nextValue: typeof value) => {
    setValue(nextValue);
    if (onChange) {
      onChange(nextValue);
    }
  };

  const themeClassName =
            ['default', 'dark', 'ios', 'android', 'android-dark'].indexOf(theme) === -1 ?
              'default' : theme;

  const dataConfigList = normalizeDateConfig(dateConfig);

  return (
    <div
      className={`datepicker ${themeClassName}`}>
      {showHeader && (
        <div className='datepicker-header'>
          {customHeader || convertDate(value, headerFormat)}
        </div>
      )}
      {showCaption && (
        <div className='datepicker-caption'>
          {dataConfigList.map((item, index) => (
          <div key={index} className='datepicker-caption-item'>{item.caption}</div>
          ))}
        </div>
      )}
      <div className='datepicker-content'>
        {dataConfigList.map((item, index) => (
          <DatePickerItem
            key={index}
            value={value}
            min={min}
            max={max}
            step={item.step}
            type={item.type}
            format={item.format}
            onSelect={handleDateSelect} />
        ))}
      </div>
      {showFooter && <div className='datepicker-navbar'>
        <button
          className='datepicker-navbar-btn'
          onClick={handleFinishBtnClick}>{confirmText}</button>
        <button
          className='datepicker-navbar-btn'
          onClick={onCancel}>{cancelText}</button>
      </div>}
    </div>
  );
};


export default DatePicker;
