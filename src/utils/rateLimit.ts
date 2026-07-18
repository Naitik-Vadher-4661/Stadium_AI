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
    
    // Fetch current rate limit record for this IP
    const { data: record, error: fetchError } = await supabase
      .from('api_rate_limits')
      .select('count, window_start')
      .eq('ip', ip)
      .single();

    const now = new Date();

    if (fetchError && fetchError.code === 'PGRST116') {
      // Record not found (No rows returned), insert a new one
      const { error: insertError } = await supabase
        .from('api_rate_limits')
        .insert([{ ip, count: 1, window_start: now.toISOString() }]);
        
      if (insertError) {
        console.error('Rate limit insert error:', insertError);
        return true; // Fail open to not block legitimate traffic on DB error
      }
      return true;
    } else if (fetchError) {
      console.error('Rate limit fetch error:', fetchError);
      return true; // Fail open
    }

    if (!record) return true;

    const windowStart = new Date(record.window_start).getTime();
    
    // Check if we are past the 1-minute window
    if (now.getTime() - windowStart > RATE_LIMIT_WINDOW_MS) {
      // Reset the window
      await supabase
        .from('api_rate_limits')
        .update({ count: 1, window_start: now.toISOString() })
        .eq('ip', ip);
      return true;
    }

    // If within the window, check the count
    if (record.count >= MAX_REQUESTS_PER_WINDOW) {
      return false; // Rate limited
    }

    // Increment count
    await supabase
      .from('api_rate_limits')
      .update({ count: record.count + 1 })
      .eq('ip', ip);
      
    return true; // Allowed

  } catch (error) {
    console.error('Rate limiting error:', error);
    return true; // Fail open
  }
}
