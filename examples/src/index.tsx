import './main.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import '../../lib/index.css';
import DatePicker from '../../lib';

const App = () => {
  const [time, setTime] = React.useState(new Date());
  const [isOpen, setIsOpen] = React.useState(false);
  const [theme, setTheme] = React.useState('default');
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
    <div className="App">
      <p className="select-time ">
        {time.toLocaleDateString()}
      </p>
      <div>
        <a
          className="select-btn sm"
          onClick={() => handleThemeToggle('default')}>
          default
        </a>
        <a
          className="select-btn sm"
          onClick={() => handleThemeToggle('dark')}>
          dark
        </a>
        <a
          className="select-btn sm"
          onClick={() => handleThemeToggle('ios')}>
          ios
        </a>
        <a
          className="select-btn sm"
          onClick={() => handleThemeToggle('android')}>
          android
        </a>
        <a
          className="select-btn sm"
          onClick={() => handleThemeToggle('android-dark')}>
          android-dark
        </a>
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
