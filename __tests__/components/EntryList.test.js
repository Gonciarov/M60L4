// __tests__/components/EntryList.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import EntryList from '../../app/components/EntryList';

global.fetch = jest.fn();

describe('EntryList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockReset();
  });

  it('displays entries when fetched', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        entries: [
          {
            id: '123',
            title: 'Test',
            content: 'Content',
            timestamp: '2025-04-22T08:00:00Z',
          },
        ],
      }),
    });

    render(<EntryList refreshKey={0} />);
    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  it('displays error on fetch failure', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Failed to fetch' }),
    });

    render(<EntryList refreshKey={0} />);
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch entries')).toBeInTheDocument();
    });
  });

  it('displays no entries message when empty', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ entries: [] }),
    });

    render(<EntryList refreshKey={0} />);
    await waitFor(() => {
      expect(screen.getByText('No entries yet.')).toBeInTheDocument();
    });
  });

  it('refetches entries when refreshKey changes', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        entries: [{ id: '123', title: 'Test', content: 'Content', timestamp: '2025-04-22T08:00:00Z' }],
      }),
    });

    const { rerender } = render(<EntryList refreshKey={0} />);
    await waitFor(() => screen.getByText('Test'));

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        entries: [{ id: '124', title: 'New', content: 'New Content', timestamp: '2025-04-22T09:00:00Z' }],
      }),
    });

    rerender(<EntryList refreshKey={1} />);
    await waitFor(() => {
      expect(screen.getByText('New')).toBeInTheDocument();
      expect(screen.queryByText('Test')).not.toBeInTheDocument();
    });
  });
});