import { Unit } from './time';

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



