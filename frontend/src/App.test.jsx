import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders create template form', () => {
    render(<App />);
    expect(screen.getByText(/Create Template/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Style Description/i)).toBeInTheDocument();
  });
});
