import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/WebUtility/i)).toBeInTheDocument();
  });

  it('shows the text formatter by default', () => {
    render(<App />);
    expect(screen.getByText(/Text Formatter/i)).toBeInTheDocument();
  });
});