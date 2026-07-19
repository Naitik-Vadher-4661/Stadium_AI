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
    // Setup mock responses
    mockFetch.mockImplementation((url, options) => {
      if (options && options.method === 'POST') {
        return Promise.resolve({
          ok: true,
          status: 200,
          headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' }),
          body: new ReadableStream({
            start(controller) {
              controller.enqueue(new TextEncoder().encode('0:"Leave in 10 minutes to catch your train."\n'));
              controller.close();
            }
          }),
          text: async () => 'Leave in 10 minutes to catch your train.',
        });
      }

      // Default GET request
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ([
          { id: '1', mode: 'Train', route: 'Northbound', departure: '10:00 PM', status: 'On Time' }
        ])
      });
    });

    render(<TransitPage />);

    // Check loading state immediately
    expect(screen.getByText(/Loading schedules/i)).toBeTruthy();

    // Wait for the recommendation text to appear
    await waitFor(() => {
      expect(screen.getByText(/Leave in 10 minutes to catch your train/i)).toBeTruthy();
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
      expect(screen.getByText(/Could not fetch transit recommendation at this time/i)).toBeTruthy();
    });
  });
});
