import {
  DateConfig, dateConfigMap, Theme, Themes,
} from '../types';

export const isTouchEvent = <T extends HTMLElement>(e: React.TouchEvent<T> | React.MouseEvent<T>): e is React.TouchEvent<T> => {
  if (!('targetTouches' in e)) {
    return false;
  }
  return !!(e.targetTouches[0]);
};

export const isWheelEvent = <T extends HTMLElement>(e: React.TouchEvent<T> | React.MouseEvent<T> | React.WheelEvent<T>): e is React.WheelEvent<T> => {
  if (!('deltaY' in e)) {
    return false;
  }
  return true
};

export const isFunction = (val: unknown): val is Function => !!val && Object.prototype.toString.apply(val) === '[object Function]';

export const isDateConfigKey = (val: unknown): val is keyof typeof dateConfigMap => typeof val === 'string' && dateConfigMap.hasOwnProperty(val);

export const isObject = (val: unknown): val is Record<string, unknown> => !!val && typeof val === 'object';

export const isDateConfig = (val: unknown): val is DateConfig => isObject(val) && typeof val.type === 'string' && isDateConfigKey(val.type);

export const isTheme = (val: unknown): val is Theme => typeof val === 'string' && !!Themes.find(theme => theme === val);
