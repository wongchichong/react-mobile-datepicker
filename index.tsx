
import DatePicker, { Theme, Themes } from './lib'
import { $, render } from 'voby'
import './index.css'

const App = () => {
    const time = $(new Date())
    const isOpen = $(false)
    const theme = $<Theme>('default')
    const handleToggle = (nextIsOpen: boolean) => {
        isOpen(nextIsOpen)
    }

    const handleThemeToggle = (nextTheme: typeof theme) => {
        theme(nextTheme)
        isOpen(true)
    }

    const handleSelect = (nextTime: typeof time) => {
        time(nextTime)
        isOpen(false)
    }

    return (
        <div className='root'>
            <div className='time'>
                {() => time().toLocaleDateString()}
            </div>
            <div>
                {Themes.map(t => (
                    <div
                        className='button'
                        onClick={() => handleThemeToggle(t)}
                    >
                        {t}
                    </div>
                ))}
            </div>
            <DatePicker
                value={time}
                max={new Date()}
                theme={theme}
                isOpen={isOpen}
                showCaption
                dateConfig={[
                    {
                        type: 'year',
                        format: 'YYYY',
                        caption: '年',
                        step: 1,
                    }, {
                        type: 'month',
                        format: 'M',
                        caption: '月',
                        step: 1,
                    }, {
                        type: 'date',
                        format: 'D',
                        caption: '日',
                        step: 1,
                    }]
                }
                onSelect={handleSelect}
                onCancel={() => handleToggle(false)}
            />
        </div>
    )
}


render(<App />, document.getElementById('react-box'))
