
-- Add email column to impersonation_tokens table
ALTER TABLE public.impersonation_tokens
ADD COLUMN email TEXT;

