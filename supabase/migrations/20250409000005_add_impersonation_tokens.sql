
-- Create impersonation_tokens table to store single-use tokens for user impersonation
CREATE TABLE IF NOT EXISTS public.impersonation_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  used_at TIMESTAMPTZ
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_impersonation_tokens_user_id ON public.impersonation_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_impersonation_tokens_token ON public.impersonation_tokens(token);
CREATE INDEX IF NOT EXISTS idx_impersonation_tokens_expires_at ON public.impersonation_tokens(expires_at);

-- Add RLS policies
ALTER TABLE public.impersonation_tokens ENABLE ROW LEVEL SECURITY;

-- Only admins can create impersonation tokens
CREATE POLICY "Admins can create impersonation tokens" ON public.impersonation_tokens
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  )
);

-- Anyone can read a token (to verify it), but not list all tokens
CREATE POLICY "Anyone can read a token" ON public.impersonation_tokens
FOR SELECT TO public
USING (true);

-- Only service role can update used_at (to prevent reuse)
CREATE POLICY "Service role can update tokens" ON public.impersonation_tokens
FOR UPDATE TO service_role
USING (true);

-- Add comment for documentation
COMMENT ON TABLE public.impersonation_tokens IS 'Stores single-use tokens for user impersonation by admins.';
COMMENT ON COLUMN public.impersonation_tokens.token IS 'The single-use token for impersonation.';
COMMENT ON COLUMN public.impersonation_tokens.expires_at IS 'The timestamp when the token expires.';
COMMENT ON COLUMN public.impersonation_tokens.used_at IS 'The timestamp when the token was used.';

