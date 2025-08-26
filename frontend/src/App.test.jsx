import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import App from './App';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';

describe('App', () => {
  it('renders create template form', () => {
    render(<App />);
    expect(screen.getByText(/Create Template/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Style Description/i)).toBeInTheDocument();
  });

  it('shows progress and download link when creating template', async () => {
    const mockResp = { template_id: 'abc', download_url: '/templates/abc' };
    global.fetch = vi.fn().mockResolvedValue({ json: () => Promise.resolve(mockResp) });

    render(<App />);
    fireEvent.click(screen.getAllByText('Create')[0]);

    expect(screen.getByText(/Creating.../i)).toBeInTheDocument();
    await screen.findByText('Download template');
    expect(screen.getByRole('link', { name: /download template/i })).toHaveAttribute('href', '/templates/abc');
    expect(global.fetch).toHaveBeenCalled();
  });
});
