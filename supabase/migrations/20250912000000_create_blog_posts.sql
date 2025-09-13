-- Create the posts table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content JSONB, -- For rich text content from an editor
    header_image_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft' or 'published'
    author_id UUID REFERENCES auth.users(id),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update updated_at on post update
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policies for posts
CREATE POLICY "Public can read published posts" ON posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage all posts" ON posts
    FOR ALL USING (
        (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'admin'
    ) WITH CHECK (
        (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'admin'
    );

-- Create a bucket for post images if it doesn't exist
-- Ensure the storage schema is created
-- CREATE SCHEMA IF NOT EXISTS storage;

-- You may need to run this part manually via Supabase dashboard if policies are restrictive
-- Or grant temporary superuser to the migration user
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'post_images'
    ) THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('post_images', 'post_images', true);
    END IF;
END $$;


-- Policies for post_images bucket
CREATE POLICY "Public can view post images" ON storage.objects
    FOR SELECT USING (bucket_id = 'post_images');

CREATE POLICY "Admins can upload post images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'post_images' AND
        (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'admin'
    );

CREATE POLICY "Admins can update their own post images" ON storage.objects
    FOR UPDATE USING (
        (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'admin'
    );

CREATE POLICY "Admins can delete their own post images" ON storage.objects
    FOR DELETE USING (
        (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'admin'
    );

