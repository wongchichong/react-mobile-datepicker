import React, {
  FC, useCallback, useEffect, useRef, useState,
} from 'react';

import { addPrefixCss, formatCss } from './prefix';
import { convertDate, nextMap, Unit } from './time';

const DATE_HEIGHT = 40;
const DATE_LENGTH = 10;
const MIDDLE_INDEX = Math.floor(DATE_LENGTH / 2);
const MIDDLE_Y = - DATE_HEIGHT * MIDDLE_INDEX;

const isUndefined = (val: any) => typeof val === 'undefined';

const isTouchEvent = (e: any): e is React.TouchEvent<HTMLDivElement> => {
  return !isUndefined(e.targetTouches) &&
         !isUndefined(e.targetTouches[0]);
};

const isFunction = (val: any): val is Function => Object.prototype.toString.apply(val)  === '[object Function]';

interface Props {
  type: Unit,
  value: Date,
  min: Date,
  max: Date,
  format: string | ((date: Date) => string),
  step: number,
  onSelect: Function,
}

const iniDates = ({ step, type, value }: Pick<Props, 'step' | 'type' | 'value'>) => Array(...Array(DATE_LENGTH))
  .map((date, index) =>
    nextMap[type](value, (index - MIDDLE_INDEX) * step));


const DatePickerItem: FC<Props> = ({
  type,
  value,
  min,
  max,
  format,
  step,
  onSelect,
}) => {
  const scroll = useRef<HTMLUListElement | null>(null);
  const [animating, setAnimating] = useState(false);
  const touchY = useRef(0);
  const translateY = useRef(0);
  const currentIndex = useRef(MIDDLE_INDEX);
  const moveDateCount = useRef(0);
  const [mouseDown, setMouseDown] = useState(false);
  const moveToTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [stateTranslateY, setStateTranslateY] = useState(MIDDLE_Y);
  const [dates, setDates] = useState(iniDates({ step, type, value }));

  const [marginTop, setMarginTop] = useState(0);
  useEffect(() => () => {
    if (moveToTimer.current) {
      clearTimeout(moveToTimer.current);
    }
  }, [moveToTimer]);
  useEffect(() => {
    currentIndex.current = MIDDLE_INDEX;
    setStateTranslateY(MIDDLE_Y);
    setMarginTop(0);
    setDates(iniDates({ step, type, value }));
  }, [step, type, value]);

  const updateDates = (direction: number) => {
    if (direction === 1) {
      currentIndex.current++;
      setDates(
        [
          ...dates.slice(1),
          nextMap[type](dates[dates.length - 1], step),
        ]);
    } else {
      currentIndex.current--;
      setDates(
        [
          nextMap[type](dates[0], -step),
          ...dates.slice(0, dates.length - 1),
        ],
      );
    }
    setMarginTop((currentIndex.current - MIDDLE_INDEX) * DATE_HEIGHT);
  };

  const checkIsUpdateDates = (direction: number, nextTranslateY: number) => {
    return direction === 1 ?
      currentIndex.current * DATE_HEIGHT + DATE_HEIGHT / 2 < -nextTranslateY :
      currentIndex.current * DATE_HEIGHT - DATE_HEIGHT / 2 > -nextTranslateY;
  };

  const clearTransition = (obj: any) => {
    addPrefixCss(obj, { transition: '' });
  };

  const moveTo = (nextCurrentIndex: number) => {
    setAnimating(true);
    if (scroll.current) {
      addPrefixCss(scroll.current, { transition: 'transform .2s ease-out' });
    }
    setStateTranslateY(-nextCurrentIndex * DATE_HEIGHT);

    // NOTE: There is no transitionend, setTimeout is used instead.
    moveToTimer.current = setTimeout(() => {
      setAnimating(false);
      onSelect(dates[MIDDLE_INDEX]);
      clearTransition(scroll.current);
    }, 200);
  };

  const moveToNext = (direction: number) => {
    const date = dates[MIDDLE_INDEX];
    if (direction === -1 && date.getTime() < min.getTime() && moveDateCount.current) {
      updateDates(1);
    } else if (direction === 1 && date.getTime() > max.getTime() && moveDateCount.current) {
      updateDates(-1);
    }

    moveTo(currentIndex.current);
  };


  const handleStart = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement> ) => {
    touchY.current = isTouchEvent(event) ? 
      event.targetTouches[0].pageY :
      event.pageY;

    translateY.current = stateTranslateY;
    moveDateCount.current = 0;
  };

  const handleMove = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    const nextTouchY = isTouchEvent(event) ? 
      event.targetTouches[0].pageY :
      event.pageY;

    const dir = nextTouchY - touchY.current;
    const nextTranslateY = translateY.current + dir;
    const direction = dir > 0 ? -1 : 1;

    const date = dates[MIDDLE_INDEX];
    if (date.getTime() < min.getTime() ||
      date.getTime() > max.getTime()) {
      return;
    }

    if (checkIsUpdateDates(direction, nextTranslateY)) {
      moveDateCount.current += direction > 0 ? 1 : - 1;
      updateDates(direction);
    }

    setStateTranslateY(nextTranslateY);
  };

  const handleEnd = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    const nextTouchY = isTouchEvent(event) ? event.changedTouches[0].pageY : event.pageY;
    const dir = nextTouchY - touchY.current;
    const direction = dir > 0 ? -1 : 1;
    moveToNext(direction);
  };

  const handleContentTouch: React.TouchEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    if (animating) return;
    if (event.type === 'touchstart') {
      handleStart(event);
    } else if (event.type === 'touchmove') {
      handleMove(event);
    } else if (event.type === 'touchend') {
      handleEnd(event);
    }
  };

  const handleContentMouseMove: EventListener = (event) => {
    if (animating) return;
    handleMove(event as any);
  };

  const handleContentMouseUp: EventListener = (event) => {
    if (animating) return;
    setMouseDown(false);
    handleEnd(event as any);
  };

  const handleContentMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (animating) return;
    setMouseDown(true);
    handleStart(event);
  };

  useEffect(() => {
    if (mouseDown) {
      document.addEventListener('mousemove', handleContentMouseMove);
      document.addEventListener('mouseup', handleContentMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleContentMouseMove);
        document.removeEventListener('mouseup', handleContentMouseUp);
      };
    }
  }, [mouseDown, handleContentMouseMove, handleContentMouseUp]);
  const renderDatepickerItem = useCallback((date: Date, index: number) => {
    const className =
      (date < min || date > max) ?
        'disabled' : '';

    let formatDate;
    if (isFunction(format)) {
      formatDate = format(date);
    } else {
      formatDate = convertDate(date, format);
    }

    return (
      <li
        key={`${index}`}
        className={className}>
        {formatDate}
      </li>
    );
  }, [min, max, format]);

  const scrollStyle = formatCss({
    transform: `translateY(${stateTranslateY}px)`,
    marginTop: `${marginTop}px`,
  });
  return (
      <div className='datepicker-col-1'>
        <div
          className='datepicker-viewport'
          // ref={viewport}
          onTouchStart={handleContentTouch}
          onTouchMove={handleContentTouch}
          onTouchEnd={handleContentTouch}
          onMouseDown={handleContentMouseDown}
        >
          <div className='datepicker-wheel'>
            <ul
              ref={scroll}
              className='datepicker-scroll'
              style={scrollStyle}
            >
              {dates.map(renderDatepickerItem)}
            </ul>
          </div>
        </div>
      </div>
  );
};

export default React.memo(DatePickerItem, (prevProps, nextProps) => prevProps.value.getTime() === nextProps.value.getTime());
