import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '../utils/test-utils';
import TransitPage from '@/app/transit/page';

// Mock Next.js fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Transit Page', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders loading state then success state with mock data', async () => {
    // Setup mock response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        recommendation: 'Leave in 10 minutes to catch your train.',
        schedule: [
          { id: '1', mode: 'Train', route: 'Northbound', departure: '10:00 PM', status: 'On Time' }
        ]
      })
    } as Response);

    render(<TransitPage />);

    // Check loading state immediately
    expect(screen.getByText(/Calculating walking distance/i)).toBeTruthy();

    // Wait for the recommendation text to appear
    await waitFor(() => {
      expect(screen.getByText('Leave in 10 minutes to catch your train.')).toBeTruthy();
    });

    // Wait for schedule to render
    expect(screen.getByText('Northbound')).toBeTruthy();
    expect(screen.getByText('10:00 PM')).toBeTruthy();
    expect(screen.getByText('On Time')).toBeTruthy();
  });

  it('handles fetch failure gracefully', async () => {
    // Setup fetch to throw
    mockFetch.mockRejectedValueOnce(new Error('Network failure'));

    render(<TransitPage />);

    await waitFor(() => {
      expect(screen.getByText(/Network error while fetching transit data/i)).toBeTruthy();
    });
  });
});
