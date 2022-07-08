import { Unit } from '../types';

function throwIfInvalidDate(date: Date) {
  if (Object.prototype.toString.call(date) !== '[object Date]') {
    throw new Error('Invalid Date');
  }
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function convertDate(date: Date, format: string) {
  let str = format;
  const o = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  };
  if (/(Y+)/.test(format)) {
    str = str.replace(RegExp.$1, date.getFullYear().toString().substr(4 - RegExp.$1.length));
  }

  Object.entries(o).map(([k, v]) => {
    if (new RegExp(`(${k})`).test(format)) {
      str = str.replace(
        RegExp.$1,
        (RegExp.$1.length === 1)
          ? `${v}`
          : `00${v}`.substr(v.toString().length),
      );
    }
  });

  return str;
}

export function nextYear(now: Date, index = 0) {
  throwIfInvalidDate(now);
  const date = new Date(
    now.getFullYear() + index,
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
  );
  return date;
}

export function nextMonth(now: Date, index = 0) {
  throwIfInvalidDate(now);
  const year = now.getFullYear();
  const month = now.getMonth() + index;
  const dayOfMonth = Math.min(now.getDate(), daysInMonth(year, month));
  const date = new Date(
    year,
    month,
    dayOfMonth,
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
  );
  return date;
}

export function nextDate(now: Date, index = 0) {
  throwIfInvalidDate(now);
  const date = new Date(now.getTime() + index * 24 * 60 * 60 * 1000);
  return date;
}

export function nextHour(now: Date, index = 0) {
  throwIfInvalidDate(now);
  const date = new Date(now.getTime() + index * 60 * 60 * 1000);
  return date;
}

export function nextMinute(now: Date, index = 0) {
  throwIfInvalidDate(now);
  const date = new Date(now.getTime() + index * 60 * 1000);
  return date;
}

export function nextSecond(now: Date, index = 0) {
  throwIfInvalidDate(now);
  const date = new Date(now.getTime() + index * 1000);
  return date;
}

export const nextMap: {
  [k in Unit]: typeof nextYear | typeof nextMonth | typeof nextDate | typeof nextMinute | typeof nextSecond | typeof nextHour;
} = {
  'year': nextYear,
  'month': nextMonth,
  'date': nextDate,
  'hour': nextHour,
  'minute': nextMinute,
  'second': nextSecond,
};
