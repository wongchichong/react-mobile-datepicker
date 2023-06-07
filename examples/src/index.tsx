import * as React from 'react';
import './index.css'
import * as ReactDOM from 'react-dom';
import DatePicker, { Theme, Themes } from '../../lib';

const App = () => {
  const [time, setTime] = React.useState(new Date());
  const [isOpen, setIsOpen] = React.useState(false);
  const [theme, setTheme] = React.useState<Theme>('default');
  const handleToggle = (nextIsOpen: typeof isOpen) => {
    setIsOpen(nextIsOpen);
  }

  const handleThemeToggle = (nextTheme: typeof theme) => {
    setTheme(nextTheme);
    setIsOpen(true);
  }

  const handleSelect = (nextTime: typeof time) => {
    setTime(nextTime);
    setIsOpen(false);
  }

  return (
    <div className='root'>
      <div className='time'>
        {time.toLocaleDateString()}
      </div>
      <div>
        {Themes.map(t => (
          <div
            key={`button-${t}`}
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
  );
}

export default

  ReactDOM.render(<App />, document.getElementById('react-box'));
