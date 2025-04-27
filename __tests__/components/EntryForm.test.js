// __tests__/components/EntryForm.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EntryForm from '../../app/components/EntryForm';

global.fetch = jest.fn();

describe('EntryForm', () => {
  const mockOnEntryAdded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockReset();
  });

  it('renders form elements', () => {
    render(<EntryForm onEntryAdded={mockOnEntryAdded} />);
    expect(screen.getByLabelText(/Title:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Content:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Entry/i })).toBeInTheDocument();
  });

  it('submits form and calls onEntryAdded on success', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Entry saved' }),
    });

    render(<EntryForm onEntryAdded={mockOnEntryAdded} />);
    fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Content:/i), { target: { value: 'Content' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Entry/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/entries', expect.any(Object));
      expect(mockOnEntryAdded).toHaveBeenCalled();
      expect(screen.getByText('Entry saved!')).toBeInTheDocument();
    });
  });

  it('displays error on failed submission', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Failed to save' }),
    });

    render(<EntryForm onEntryAdded={mockOnEntryAdded} />);
    fireEvent.change(screen.getByLabelText(/Title:/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Content:/i), { target: { value: 'Content' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Entry/i }));

    await waitFor(() => {
      expect(screen.getByText('Failed to save')).toBeInTheDocument();
    });
  });
});