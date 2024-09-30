import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

test('renders the Button component', () => {
  const onClick = jest.fn();
  render(<Button label="Click Me" onClick={onClick} />);
  
  const buttonElement = screen.getByText(/Click Me/i);
  expect(buttonElement).toBeInTheDocument();

  fireEvent.click(buttonElement);
  expect(onClick).toHaveBeenCalledTimes(1);
});

