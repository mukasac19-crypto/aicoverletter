-- supabase/migrations/20240722120000_create_usage_limits_rls_policy.sql

-- Enable RLS for the usage_limits table if not already enabled
ALTER TABLE public.usage_limits ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, to avoid conflicts
DROP POLICY IF EXISTS "Allow users to insert their own usage records" ON public.usage_limits;
DROP POLICY IF EXISTS "Allow users to update their own usage records" ON public.usage_limits;

-- Policy: Allow users to insert their own usage records
CREATE POLICY "Allow users to insert their own usage records"
ON public.usage_limits
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Allow users to update their own usage records
CREATE POLICY "Allow users to update their own usage records"
ON public.usage_limits
FOR UPDATE
USING (auth.uid() = user_id);

-- Granting USAGE on the schema to the authenticated role
GRANT USAGE ON SCHEMA public TO authenticated;

-- Granting necessary permissions on the table to the authenticated role
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.usage_limits TO authenticated;
