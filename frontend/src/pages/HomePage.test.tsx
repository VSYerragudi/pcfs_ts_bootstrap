import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';

describe('HomePage', () => {
  it('renders the page title', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByText('Vite + React')).toBeInTheDocument();
  });

  it('renders the counter button', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /count is/i })).toBeInTheDocument();
  });

  it('renders documentation links', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByRole('link', { name: /vite logo/i })).toHaveAttribute(
      'href',
      'https://vite.dev'
    );
    expect(screen.getByRole('link', { name: /react logo/i })).toHaveAttribute(
      'href',
      'https://react.dev'
    );
  });
});
