export type Unit = 'year' | 'month' | 'date' | 'hour' | 'minute' | 'second';

export enum Direction {
  UP = 1,
  DOWN = -1,
}

export const Themes = ['default', 'dark', 'ios', 'android', 'android-dark'] as const;
export type Theme = typeof Themes[number];

export interface DateConfig {
  format: string,
  caption: string,
  step: number,
  type: Unit,
}

export const dateConfigMap: {
  [key in Unit]: DateConfig;
} = {
  'year': {
    format: 'YYYY',
    caption: 'Year',
    step: 1,
    type: 'year',
  },
  'month': {
    format: 'M',
    caption: 'Mon',
    step: 1,
    type: 'month',
  },
  'date': {
    format: 'D',
    caption: 'Day',
    step: 1,
    type: 'date',
  },
  'hour': {
    format: 'hh',
    caption: 'Hour',
    step: 1,
    type: 'hour',
  },
  'minute': {
    format: 'mm',
    caption: 'Min',
    step: 1,
    type: 'minute',
  },
  'second': {
    format: 'hh',
    caption: 'Sec',
    step: 1,
    type: 'second',
  },
};



