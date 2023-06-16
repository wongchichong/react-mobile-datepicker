import { $, $$, CSSProperties, useEffect } from 'voby'

import { Direction, Unit } from './types'
import { isFunction, isTouchEvent, isWheelEvent } from './utils'
import { convertDate, nextMap } from './utils/time'

const DATE_HEIGHT = 40
const DATE_LENGTH = 10
const MIDDLE_INDEX = Math.floor(DATE_LENGTH / 2)
const MIDDLE_Y = - DATE_HEIGHT * MIDDLE_INDEX


interface Props {
    type: ObservableMaybe<Unit>,
    value: ObservableMaybe<Date>,
    min: ObservableMaybe<Date>,
    max: ObservableMaybe<Date>,
    format: ObservableMaybe<string | ((date: Date) => string)>,
    step: ObservableMaybe<number>,
    onSelect: ObservableMaybe<Function>,
    /** todo should change to date steps not pixel steps*/
    // fastWheelMultiplier?: number
}

const iniDates = ({ step, type, value }: Pick<Props, 'step' | 'type' | 'value'>) => Array(...Array(DATE_LENGTH))
    .map((date, index) =>
        nextMap[$$(type)]($$(value), (index - MIDDLE_INDEX) * $$(step)))


const DatePickerItem = ({
    type,
    value,
    min,
    max,
    format,
    step,
    onSelect,
    // fastWheelMultiplier = 10,
}: Props) => {
    const isAnimating = $(false)
    const touchY = $(0)
    const translateY = $(0)
    const currentIndex = $(MIDDLE_INDEX)
    const moveDateCount = $(0)
    const mouseDown = $(false)
    const moveToTimer = $<ReturnType<typeof setTimeout>>(0)
    const stateTranslateY = $(MIDDLE_Y)
    const dates = $(iniDates({ step, type, value }))
    const lastScrollTime = $(performance.now())
    const lastScrollDelta = $(0)

    const marginTop = $(0)

    useEffect(() => () => {
        console.log('1 useEffect')
        if (moveToTimer()) {
            clearTimeout(moveToTimer())
        }
    })

    useEffect(() => {
        if (dates().length === 1) debugger
        console.log('dates', dates().length)
    })
    useEffect(() => {
        console.log('2 useEffect')
        currentIndex(MIDDLE_INDEX)
        stateTranslateY(MIDDLE_Y)
        marginTop(0)
        dates(e => {
            const r = iniDates({ step, type, value })
            if (r.length === 1) debugger
            return r
        })
    })

    const updateDates = (direction: Direction) => {
        if (direction === Direction.UP) {
            currentIndex(c => ++c)
            dates(e => {
                const r = [
                    ...dates().slice(1),
                    nextMap[$$(type)](dates()[dates.length - 1], $$(step)),
                ]
                if (r.length === 1) debugger

                return r
            })
        } else {
            currentIndex(c => --c)
            dates(e => {
                const r = [
                    nextMap[$$(type)](dates()[0], -step),
                    ...dates().slice(0, dates.length - 1),
                ]

                if (r.length === 1) debugger
                return r
            })
        }
        marginTop((currentIndex() - MIDDLE_INDEX) * DATE_HEIGHT)
    }

    const checkIsUpdateDates = (direction: Direction, nextTranslateY: number) => {
        return direction === Direction.UP ?
            currentIndex() * DATE_HEIGHT + DATE_HEIGHT / 2 < -nextTranslateY :
            currentIndex() * DATE_HEIGHT - DATE_HEIGHT / 2 > -nextTranslateY
    }

    const moveTo = (nextCurrentIndex: number) => {
        isAnimating(true)
        stateTranslateY(-nextCurrentIndex * DATE_HEIGHT)

        // NOTE: There is no transitionend, setTimeout is used instead.
        moveToTimer(setTimeout(() => {
            isAnimating(false)
            $$(onSelect)(dates()[MIDDLE_INDEX])
        }, 200))
    }

    const moveToNext = (direction: Direction) => {
        const date = dates()[MIDDLE_INDEX]
        if (direction === Direction.UP && date.getTime() < $$(min).getTime() && moveDateCount()) {
            updateDates(Direction.UP)
        } else if (direction === Direction.DOWN && date.getTime() > $$(max).getTime() && moveDateCount()) {
            updateDates(Direction.DOWN)
        }

        moveTo(currentIndex())
    }

    const handleStart = (event: TargetedTouchEvent<HTMLDivElement> | TargetedMouseEvent<HTMLDivElement> | TargetedWheelEvent<HTMLDivElement>) => {
        touchY(isTouchEvent(event) ?
            event.targetTouches[0].pageY :
            isWheelEvent(event) ? 0 :
                event.pageY)

        translateY(stateTranslateY())
        moveDateCount(0)
    }

    const getScrollSpeed = (event: TargetedTouchEvent<HTMLDivElement> | TargetedMouseEvent<HTMLDivElement> | TargetedWheelEvent<HTMLDivElement>) => {
        const isWheel = isWheelEvent(event)
        /// detect scroll speed
        const currentScrollTime = performance.now()
        const currentScrollDelta = isWheel ? -event.deltaY : 0

        const deltaTime = currentScrollTime - lastScrollTime()
        const deltaScroll = Math.abs(currentScrollDelta - lastScrollDelta())

        const scrollSpeed = deltaScroll / deltaTime

        lastScrollTime(currentScrollTime)
        lastScrollDelta(currentScrollDelta)

        return { isWheel, scrollSpeed }
    }

    const handleMove = (event: TargetedTouchEvent<HTMLDivElement> | TargetedMouseEvent<HTMLDivElement> | TargetedWheelEvent<HTMLDivElement>) => {
        const { isWheel, scrollSpeed } = getScrollSpeed(event)

        let nextTouchY = isTouchEvent(event) ?
            event.targetTouches[0].pageY :
            isWheel ? -(event as TargetedWheelEvent<HTMLDivElement>).deltaY * (scrollSpeed > 3 ? /* fastWheelMultiplier */10 : 1) :
                event.pageY

        const dir = nextTouchY - touchY()
        const nextTranslateY = translateY() + dir
        const direction = dir > 0 ? Direction.DOWN : Direction.UP

        const date = dates()[MIDDLE_INDEX]

        console.log(dir, date)
        if (date.getTime() < $$(min).getTime() || date.getTime() > $$(max).getTime())
            return

        if (checkIsUpdateDates(direction, nextTranslateY)) {
            moveDateCount(d => d + direction)
            updateDates(direction)
        }

        stateTranslateY(nextTranslateY)
    }
    const handleEnd = (event: TargetedTouchEvent<HTMLDivElement> | TargetedMouseEvent<HTMLDivElement> | TargetedWheelEvent<HTMLDivElement>) => {
        const isWheel = isWheelEvent(event)
        const nextTouchY = isTouchEvent(event) ? event.changedTouches[0].pageY : isWheel ? event.deltaY : event.pageY
        const direction = (nextTouchY - touchY()) > 0 ? Direction.UP : Direction.DOWN

        moveToNext(direction)
    }

    const handleContentTouch: TouchEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault()
        if (isAnimating()) return
        if (event.type === 'touchstart') {
            handleStart(event)
        } else if (event.type === 'touchmove') {
            handleMove(event)
        } else if (event.type === 'touchend') {
            handleEnd(event)
        }
    }

    const handleContentMouseMove: EventListener = (event) => {
        if (isAnimating()) return
        handleMove(event as any)
    }

    const handleContentMouseUp: EventListener = (event) => {
        if (isAnimating()) return
        mouseDown(false)
        handleEnd(event as any)
    }

    const handleContentMouseDown: MouseEventHandler<HTMLDivElement> = (event) => {
        event.stopPropagation()
        if (isAnimating()) return
        mouseDown(true)
        handleStart(event)
    }

    useEffect(() => {
        console.log('3 useEffect')
        if (mouseDown()) {
            document.addEventListener('mousemove', handleContentMouseMove)
            document.addEventListener('mouseup', handleContentMouseUp)
            return () => {
                console.log('3.1 useEffect')
                document.removeEventListener('mousemove', handleContentMouseMove)
                document.removeEventListener('mouseup', handleContentMouseUp)
            }
        }
    })

    const onWheel = (e: TargetedWheelEvent<HTMLDivElement>) => {
        const date = dates()[MIDDLE_INDEX]
        if (date.getTime() < $$(min).getTime() || date.getTime() > $$(max).getTime()) {
            if (date.getTime() < $$(min).getTime())
                moveToNext(Direction.UP)
            else
                moveToNext(Direction.DOWN)
            // moveTo(e.deltaY < 0 ? --currentIndex.current : ++currentIndex.current, true);
            // return;
        } else {
            handleContentMouseDown(e)
            handleMove(e)
            handleContentMouseUp(e as any)
            // --currentIndex.current;
            // moveToNext(e.deltaY > 0 ? Direction.DOWN : Direction.UP, true);

            //fix 2 scroll per row
            moveTo(e.deltaY > 0 ? currentIndex(c => --c) : currentIndex(c => ++c))
        }
    }

    const renderDatepickerItem = (date: Date, index: number) => {
        const className =
            (date < min || date > max) ?
                'disabled' : ''

        const fmt = $$(format)
        const formatDate = isFunction(fmt) ? fmt(date) : convertDate(date, fmt)

        return (
            <li
                className={className} >
                {formatDate}
            </li >
        )
    }

    const scrollStyle = {
        '--margin-top': marginTop(),
        '--translate-y': stateTranslateY(),
    } as CSSProperties

    return (
        <div className='datepicker-col-1'>
            <div
                className='datepicker-viewport'
                onTouchStart={handleContentTouch}
                onTouchMove={handleContentTouch}
                onTouchEnd={handleContentTouch}
                onMouseDown={handleContentMouseDown}
                onWheel={onWheel}
            >
                <div className='datepicker-wheel'>
                    <div
                        className={`datepicker-scroll ${isAnimating() ? 'active' : ''}`}
                        style={scrollStyle}
                    >
                        {dates().map(renderDatepickerItem)}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default DatePickerItem
// export default useMemo(DatePickerItem, (prevProps, nextProps) => prevProps.value.getTime() === nextProps.value.getTime())
