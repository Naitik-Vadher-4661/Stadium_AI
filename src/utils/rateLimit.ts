import { createClient } from '@/lib/supabase/server';

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute

/**
 * Checks if the given IP/identifier has exceeded the rate limit
 * by querying the `api_rate_limits` table in Supabase.
 * 
 * WHY: We use a simple fixed-window counter in Supabase rather than 
 * a sliding window or Redis because it limits infrastructure dependencies 
 * while providing sufficient DDOS protection and API cost control for this app scale.
 */
export async function checkRateLimit(ip: string = 'anonymous'): Promise<boolean> {
  try {
    const supabase = await createClient();
    
    // Call the check_rate_limit RPC function
    // This handles the select, insert, and update atomically in one round-trip
    const { data: isAllowed, error } = await supabase.rpc('check_rate_limit', {
      ip_address: ip,
      max_requests: MAX_REQUESTS_PER_WINDOW,
      window_ms: RATE_LIMIT_WINDOW_MS
    });

    if (error) {
      console.error('Rate limit RPC error:', error);
      return true; // Fail open
    }

    return isAllowed;

  } catch (error) {
    console.error('Rate limiting error:', error);
    return true; // Fail open
  }
}
