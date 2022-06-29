import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Root, Time, Button } from './styles';
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
    <Root>
      <Time>
        {time.toLocaleDateString()}
      </Time>
      <div>
        <Button
          onClick={() => handleThemeToggle('default')}>
          default
        </Button>
        <Button
          onClick={() => handleThemeToggle('dark')}>
          dark
        </Button>
        <Button
          onClick={() => handleThemeToggle('ios')}>
          ios
        </Button>
        <Button
          onClick={() => handleThemeToggle('android')}>
          android
        </Button>
        <Button
          onClick={() => handleThemeToggle('android-dark')}>
          android-dark
        </Button>
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
    </Root>
  );
}

export default 

ReactDOM.render(<App />, document.getElementById('react-box'));
