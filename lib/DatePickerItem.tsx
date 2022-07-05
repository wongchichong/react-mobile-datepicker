import React, {
  FC, useCallback, useEffect, useRef, useState,
} from 'react';
import styled, { css } from 'styled-components';

import { Direction, Unit } from './types';
import { isFunction, isTouchEvent } from './utils';
import { convertDate, nextMap } from './utils/time';

const Scroll = styled.ul<{ isAnimating: boolean }>`
  transform: translateY(calc(var(--translate-y) * 1px));
  margin-top: calc(var(--margin-top) * 1px);
  ${({ isAnimating }) => isAnimating && `
   transition: transform .2s ease-out;
  `}
`;

const DATE_HEIGHT = 40;
const DATE_LENGTH = 10;
const MIDDLE_INDEX = Math.floor(DATE_LENGTH / 2);
const MIDDLE_Y = - DATE_HEIGHT * MIDDLE_INDEX;


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
  const [isAnimating, setIsAnimating] = useState(false);
  const touchY = useRef(0);
  const translateY = useRef(0);
  const currentIndex = useRef(MIDDLE_INDEX);
  const moveDateCount = useRef(0);
  const [mouseDown, setMouseDown] = useState(false);
  const moveToTimer = useRef<ReturnType<typeof setTimeout> | void>();
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

  const updateDates = (direction: Direction) => {
    if (direction === Direction.UP) {
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

  const checkIsUpdateDates = (direction: Direction, nextTranslateY: number) => {
    return direction === Direction.UP ?
      currentIndex.current * DATE_HEIGHT + DATE_HEIGHT / 2 < -nextTranslateY :
      currentIndex.current * DATE_HEIGHT - DATE_HEIGHT / 2 > -nextTranslateY;
  };

  const moveTo = (nextCurrentIndex: number) => {
    setIsAnimating(true);
    setStateTranslateY(-nextCurrentIndex * DATE_HEIGHT);

    // NOTE: There is no transitionend, setTimeout is used instead.
    moveToTimer.current = setTimeout(() => {
      setIsAnimating(false);
      onSelect(dates[MIDDLE_INDEX]);
    }, 200);
  };

  const moveToNext = (direction: Direction) => {
    const date = dates[MIDDLE_INDEX];
    if (direction === Direction.UP && date.getTime() < min.getTime() && moveDateCount.current) {
      updateDates(Direction.UP);
    } else if (direction === Direction.DOWN && date.getTime() > max.getTime() && moveDateCount.current) {
      updateDates(Direction.DOWN);
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
    const direction = dir > 0 ? Direction.DOWN : Direction.UP;

    const date = dates[MIDDLE_INDEX];
    if (date.getTime() < min.getTime() ||
      date.getTime() > max.getTime()) {
      return;
    }

    if (checkIsUpdateDates(direction, nextTranslateY)) {
      moveDateCount.current += direction;
      updateDates(direction);
    }

    setStateTranslateY(nextTranslateY);
  };

  const handleEnd = (event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    const nextTouchY = isTouchEvent(event) ? event.changedTouches[0].pageY : event.pageY;
    const direction = (nextTouchY - touchY.current) > 0 ? Direction.UP : Direction.DOWN;
    moveToNext(direction);
  };

  const handleContentTouch: React.TouchEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    if (isAnimating) return;
    if (event.type === 'touchstart') {
      handleStart(event);
    } else if (event.type === 'touchmove') {
      handleMove(event);
    } else if (event.type === 'touchend') {
      handleEnd(event);
    }
  };

  const handleContentMouseMove: EventListener = (event) => {
    if (isAnimating) return;
    handleMove(event as any);
  };

  const handleContentMouseUp: EventListener = (event) => {
    if (isAnimating) return;
    setMouseDown(false);
    handleEnd(event as any);
  };

  const handleContentMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (isAnimating) return;
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

  const scrollStyle = {
    '--margin-top': marginTop,
    '--translate-y': stateTranslateY,
  } as React.CSSProperties;

  return (
      <div className='datepicker-col-1'>
        <div
          className='datepicker-viewport'
          onTouchStart={handleContentTouch}
          onTouchMove={handleContentTouch}
          onTouchEnd={handleContentTouch}
          onMouseDown={handleContentMouseDown}
        >
          <div className='datepicker-wheel'>
            <Scroll
              isAnimating={isAnimating}
              className='datepicker-scroll'
              style={scrollStyle}
            >
              {dates.map(renderDatepickerItem)}
            </Scroll>
          </div>
        </div>
      </div>
  );
};

export default React.memo(DatePickerItem, (prevProps, nextProps) => prevProps.value.getTime() === nextProps.value.getTime());
