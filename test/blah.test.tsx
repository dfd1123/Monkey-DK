import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TextInput } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TextInput />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
