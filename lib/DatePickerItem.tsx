/**
 * @module Date组件
 */
import React, { Component } from 'react';

import { addPrefixCss, formatCss } from './prefix';
import { convertDate, nextMap, Unit } from './time';

const DATEHEIGHT = 40;                // 每个日期的高度
const DATELENGTH = 10;                // 日期的个数
const MIDDLEINDEX = Math.floor(DATELENGTH / 2);   // 日期数组中间值的索引
const MIDDLEY = - DATEHEIGHT * MIDDLEINDEX;     // translateY值

const isUndefined = (val: any) => typeof val === 'undefined';
const isFunction = (val: any): val is Function => Object.prototype.toString.apply(val)  === '[object Function]';

type Props = {
  type: Unit,
  value: Date,
  min: Date,
  max: Date,
  format: string | ((date: Date) => string),
  step: number,
  onSelect: Function,
};

type State = {
  translateY: number,
  marginTop: number,
  dates: any[],  
};

class DatePickerItem extends Component<Props, State> {
  animating: boolean;         // 判断是否在transition过渡动画之中

  touchY: number;            // 保存touchstart的pageY

  translateY: number;          // 容器偏移的距离

  currentIndex: number;     // 滑动中当前日期的索引

  moveDateCount: number;         // 一次滑动移动了多少个时间

  moveToTimer: ReturnType<typeof setTimeout> | undefined;

  viewport: Element | null = null;

  constructor(props: Props) {
    super(props);
    this.animating = false;
    this.touchY = 0;
    this.translateY = 0;
    this.currentIndex = MIDDLEINDEX;
    this.moveToTimer = undefined;
    this.moveDateCount = 0;

    this.state = {
      translateY: MIDDLEY,
      dates: [],
      marginTop: (this.currentIndex - MIDDLEINDEX) * DATEHEIGHT,
    };

    this.renderDatepickerItem = this.renderDatepickerItem.bind(this);
    this.handleContentTouch = this.handleContentTouch.bind(this);
    this.handleContentMouseDown = this.handleContentMouseDown.bind(this);
    this.handleContentMouseMove = this.handleContentMouseMove.bind(this);
    this.handleContentMouseUp = this.handleContentMouseUp.bind(this);
  }

  componentWillMount() {
    this.iniDates(this.props.value);
  }

  componentDidMount() {
    const viewport = this.viewport;
    if (viewport) {
      viewport.addEventListener('touchstart', this.handleContentTouch, false);
      viewport.addEventListener('touchmove', this.handleContentTouch, false);
      viewport.addEventListener('touchend', this.handleContentTouch, false);
      viewport.addEventListener('mousedown', this.handleContentMouseDown, false);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.value.getTime() === this.props.value.getTime()) {
      return;
    }
    this.iniDates(nextProps.value);
    this.currentIndex = MIDDLEINDEX;
    this.setState({
      translateY: MIDDLEY,
      marginTop: (this.currentIndex - MIDDLEINDEX) * DATEHEIGHT,
    });
  }

  componentWillUnmount() {
    const viewport = this.viewport;
    if (viewport) {
      viewport.removeEventListener('touchstart', this.handleContentTouch, false);
      viewport.removeEventListener('touchmove', this.handleContentTouch, false);
      viewport.removeEventListener('touchend', this.handleContentTouch, false);
      viewport.removeEventListener('mousedown', this.handleContentMouseDown, false);
    }
    
    clearTimeout(this.moveToTimer);
  }

  iniDates(date: Date) {
    const typeName = this.props.type;
    const dates = Array(...Array(DATELENGTH))
      .map((value, index) =>
        nextMap[typeName](date, (index - MIDDLEINDEX) * this.props.step));
    this.setState({ dates });
  }

  updateDates(direction: number) {
    const typeName = this.props.type;
    const { dates } = this.state;
    if (direction === 1) {
      this.currentIndex ++;
      this.setState({
        dates: [
          ...dates.slice(1),
          nextMap[typeName](dates[dates.length - 1], this.props.step),
        ],
        marginTop: (this.currentIndex - MIDDLEINDEX) * DATEHEIGHT,
      });
    } else {
      this.currentIndex --;
      this.setState({
        dates: [
          nextMap[typeName](dates[0], -this.props.step),
          ...dates.slice(0, dates.length - 1),
        ],
        marginTop: (this.currentIndex - MIDDLEINDEX) * DATEHEIGHT,
      });
    }
  }

  checkIsUpdateDates(direction: number, translateY: number) {
    return direction === 1 ?
      this.currentIndex * DATEHEIGHT + DATEHEIGHT / 2 < -translateY :
      this.currentIndex * DATEHEIGHT - DATEHEIGHT / 2 > -translateY;
  }

  /**
   * 清除对象的transition样式
   * @param  {Dom}   obj   指定的对象
   * @return {undefined}
   */
  clearTransition(obj: any) {
    addPrefixCss(obj, { transition: '' });
  }

  /**
   * 滑动到下一日期
   * @param  {number} direction 滑动方向
   * @return {undefined}
   */
  moveToNext(direction: number) {
    const date = this.state.dates[MIDDLEINDEX];
    const { max, min } = this.props;
    if (direction === -1 && date.getTime() < min.getTime() && this.moveDateCount) {
      this.updateDates(1);
    } else if (direction === 1 && date.getTime() > max.getTime() && this.moveDateCount) {
      this.updateDates(-1);
    }

    this.moveTo(this.currentIndex);
  }

  /**
   * 添加滑动动画
   * @param  {number} angle 角度
   * @return {undefined}
   */
  moveTo(currentIndex: number) {
    this.animating = true;

    addPrefixCss(this.refs.scroll as HTMLElement, { transition: 'transform .2s ease-out' });

    this.setState({ translateY: -currentIndex * DATEHEIGHT });

    // NOTE: There is no transitionend, setTimeout is used instead.
    this.moveToTimer = setTimeout(() => {
      this.animating = false;
      this.props.onSelect(this.state.dates[MIDDLEINDEX]);
      this.clearTransition(this.refs.scroll);
    }, 200);
  }

  handleStart(event: any) {
    this.touchY =
      (!isUndefined(event.targetTouches) &&
       !isUndefined(event.targetTouches[0])) ?
        event.targetTouches[0].pageY :
        event.pageY;

    this.translateY = this.state.translateY;
    this.moveDateCount = 0;
  }


  handleMove(event: any) {
    const touchY =
      (!isUndefined(event.targetTouches) &&
       !isUndefined(event.targetTouches[0])) ?
        event.targetTouches[0].pageY :
        event.pageY;

    const dir = touchY - this.touchY;
    const translateY = this.translateY + dir;
    const direction = dir > 0 ? -1 : 1;

    // 日期最小值，最大值限制
    const date = this.state.dates[MIDDLEINDEX];
    const { max, min } = this.props;
    if (date.getTime() < min.getTime() ||
      date.getTime() > max.getTime()) {
      return;
    }

    // 检测是否更新日期列表
    if (this.checkIsUpdateDates(direction, translateY)) {
      this.moveDateCount = direction > 0 ? this.moveDateCount + 1 : this.moveDateCount - 1;
      this.updateDates(direction);
    }

    this.setState({ translateY });
  }

  handleEnd(event: any) {
    const touchY = event.pageY || event.changedTouches[0].pageY;
    const dir = touchY - this.touchY;
    const direction = dir > 0 ? -1 : 1;
    this.moveToNext(direction);
  }

  /**
   * 滑动日期选择器触屏事件
   * @param  {Object} event 事件对象
   * @return {undefined}
   */
  handleContentTouch(event: any) {
    event.preventDefault();
    if (this.animating) return;
    if (event.type === 'touchstart') {
      this.handleStart(event);
    } else if (event.type === 'touchmove') {
      this.handleMove(event);
    } else if (event.type === 'touchend') {
      this.handleEnd(event);
    }
  }

  /**
   * 滑动日期选择器鼠标事件
   * @param  {Object} event 事件对象
   * @return {undefined}
   */
  handleContentMouseDown(event: any) {
    if (this.animating) return;
    this.handleStart(event);
    document.addEventListener('mousemove', this.handleContentMouseMove);
    document.addEventListener('mouseup', this.handleContentMouseUp);
  }

  handleContentMouseMove(event: any) {
    if (this.animating) return;
    this.handleMove(event);
  }

  handleContentMouseUp(event: any) {
    if (this.animating) return;
    this.handleEnd(event);
    document.removeEventListener('mousemove', this.handleContentMouseMove);
    document.removeEventListener('mouseup', this.handleContentMouseUp);
  }

  /**
   * 渲染一个日期DOM对象
   * @param  {Object} date date数据
   * @return {Object}    JSX对象
   */
  renderDatepickerItem(date: Date, index: number) {
    const className =
      (date < this.props.min || date > this.props.max) ?
        'disabled' : '';

    let formatDate;
    if (isFunction(this.props.format)) {
      formatDate = this.props.format(date);
    } else {
      formatDate = convertDate(date, this.props.format);
    }

    return (
      <li
        key={index}
        className={className}>
        {formatDate}
      </li>
    );
  }

  render() {
    const scrollStyle = formatCss({
      transform: `translateY(${this.state.translateY}px)`,
      marginTop: `${this.state.marginTop}px`,
    });

    return (
      <div className='datepicker-col-1'>
        <div
          ref={viewport => this.viewport = viewport} // eslint-disable-line
          className='datepicker-viewport'>
          <div className='datepicker-wheel'>
            <ul
              ref='scroll'
              className='datepicker-scroll'
              style={scrollStyle}>
              {this.state.dates.map(this.renderDatepickerItem)}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default DatePickerItem;
