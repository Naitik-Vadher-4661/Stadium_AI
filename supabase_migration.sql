-- Create rate limits table
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
    ip text PRIMARY KEY,
    count integer NOT NULL DEFAULT 1,
    window_start timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Block public access (no policies for anon or authenticated roles)
-- Only the service_role (which bypasses RLS) can read/write this table.
-- This ensures client-side users cannot view or manipulate rate limits.

-- Enable Row Level Security (RLS) on all remaining tables
ALTER TABLE IF EXISTS public.gate_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.crowd_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.stadium_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.stadium_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.faq_content ENABLE ROW LEVEL SECURITY;

-- Read-only policies for public tables (anon and authenticated users can read)
CREATE POLICY "Allow public read-only on stadium_locations" ON public.stadium_locations FOR SELECT USING (true);
CREATE POLICY "Allow public read-only on stadium_edges" ON public.stadium_edges FOR SELECT USING (true);
CREATE POLICY "Allow public read-only on faq_content" ON public.faq_content FOR SELECT USING (true);

-- No policies created for INSERT, UPDATE, or DELETE on any table.
-- Therefore, ONLY the service_role can modify data in these tables.
-- Additionally, gate_status and crowd_alerts have no SELECT policies for the public,
-- restricting their read access to the service_role as well.

-- -----------------------------------------------------------------------------
-- EFFICIENCY AUDIT ADDITIONS
-- -----------------------------------------------------------------------------

-- Create indexes for frequently filtered/joined columns
CREATE INDEX IF NOT EXISTS idx_stadium_edges_from ON public.stadium_edges (from_location_id);
CREATE INDEX IF NOT EXISTS idx_stadium_edges_to ON public.stadium_edges (to_location_id);
CREATE INDEX IF NOT EXISTS idx_crowd_alerts_is_resolved ON public.crowd_alerts (is_resolved);

-- Note: 'gate_name' has a UNIQUE constraint which creates an implicit index, 
-- and 'ip' is the PRIMARY KEY in api_rate_limits, which also creates an implicit index.

-- Rate Limiting RPC
-- Handles select/insert/update atomically in one round-trip
CREATE OR REPLACE FUNCTION check_rate_limit(ip_address text, max_requests int, window_ms int)
RETURNS boolean AS $$
DECLARE
  current_count int;
BEGIN
  INSERT INTO api_rate_limits (ip, count, window_start)
  VALUES (ip_address, 1, now())
  ON CONFLICT (ip) DO UPDATE
  SET count = CASE
    WHEN EXTRACT(EPOCH FROM (now() - api_rate_limits.window_start)) * 1000 > window_ms THEN 1
    ELSE api_rate_limits.count + 1
  END,
  window_start = CASE
    WHEN EXTRACT(EPOCH FROM (now() - api_rate_limits.window_start)) * 1000 > window_ms THEN now()
    ELSE api_rate_limits.window_start
  END
  RETURNING count INTO current_count;

  RETURN current_count <= max_requests;
END;
$$ LANGUAGE plpgsql;
