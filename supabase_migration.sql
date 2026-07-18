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
