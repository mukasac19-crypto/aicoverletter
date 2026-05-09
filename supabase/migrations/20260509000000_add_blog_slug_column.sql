-- Add a slug column to the blogs table so we can have clean, SEO-friendly URLs.
-- The original migration (20250912000000_create_blog_posts.sql) created the
-- table as `posts` with a slug column, but the live production table is named
-- `blogs` and is missing the slug column. This migration brings the live
-- schema in line with what the application code expects.
--
-- After running this:
--   1. Run `npm run gen:types` to regenerate types/supabase.ts so the
--      `slug` column appears in TypeScript.
--   2. Switch the blog detail route to prefer slug-based URLs (handled in
--      app/blog/[id]/page.tsx — accepts both id and slug).

-- 1. Add the slug column (nullable initially so we can backfill).
ALTER TABLE blogs
  ADD COLUMN IF NOT EXISTS slug TEXT;

-- 2. Helper function to build a slug from a title.
--    Lowercases, replaces non-alphanumeric runs with hyphens, trims leading
--    and trailing hyphens, truncates to 80 chars to avoid pathological URLs.
CREATE OR REPLACE FUNCTION slugify_text(input TEXT)
RETURNS TEXT AS $$
DECLARE
  s TEXT;
BEGIN
  IF input IS NULL THEN RETURN NULL; END IF;
  s := lower(input);
  s := regexp_replace(s, '[^a-z0-9]+', '-', 'g');
  s := trim(both '-' from s);
  s := substring(s from 1 for 80);
  s := trim(both '-' from s);
  RETURN s;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3. Backfill slugs for existing posts. Append the first 6 chars of the id
--    to guarantee uniqueness even when titles collide.
UPDATE blogs
SET slug = slugify_text(title) || '-' || substr(id::text, 1, 6)
WHERE slug IS NULL;

-- 4. Make slug required and unique going forward.
ALTER TABLE blogs
  ALTER COLUMN slug SET NOT NULL;

ALTER TABLE blogs
  ADD CONSTRAINT blogs_slug_unique UNIQUE (slug);

-- 5. Index for fast lookups in the blog detail page.
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);

-- 6. Trigger to auto-generate slugs for newly inserted rows when admins forget
--    to set one. Existing rows already have slugs from step 3.
CREATE OR REPLACE FUNCTION blogs_autoslug()
RETURNS TRIGGER AS $$
DECLARE
  base TEXT;
  candidate TEXT;
  suffix INT := 0;
BEGIN
  IF NEW.slug IS NOT NULL AND NEW.slug <> '' THEN
    RETURN NEW;
  END IF;
  base := slugify_text(NEW.title);
  IF base IS NULL OR base = '' THEN
    base := substr(NEW.id::text, 1, 8);
  END IF;
  candidate := base;
  WHILE EXISTS (SELECT 1 FROM blogs WHERE slug = candidate AND id <> NEW.id) LOOP
    suffix := suffix + 1;
    candidate := base || '-' || suffix::text;
  END LOOP;
  NEW.slug := candidate;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blogs_autoslug_trigger ON blogs;
CREATE TRIGGER blogs_autoslug_trigger
BEFORE INSERT OR UPDATE OF title ON blogs
FOR EACH ROW
EXECUTE FUNCTION blogs_autoslug();
