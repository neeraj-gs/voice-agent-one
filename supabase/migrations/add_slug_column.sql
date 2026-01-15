-- Migration: Add slug column to businesses table
-- This enables unique public URLs for each business

-- Add slug column
ALTER TABLE public.businesses
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS businesses_slug_unique
ON public.businesses (slug)
WHERE slug IS NOT NULL;

-- Generate slugs for existing businesses that don't have one
-- This creates slugs from business names (lowercase, hyphenated)
UPDATE public.businesses
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      TRIM(name),
      '[^a-zA-Z0-9\s-]',
      '',
      'g'
    ),
    '\s+',
    '-',
    'g'
  )
)
WHERE slug IS NULL;

-- Handle duplicate slugs by appending the row number
WITH duplicates AS (
  SELECT id, slug, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY created_at) as rn
  FROM public.businesses
  WHERE slug IN (
    SELECT slug FROM public.businesses GROUP BY slug HAVING COUNT(*) > 1
  )
)
UPDATE public.businesses b
SET slug = b.slug || '-' || (d.rn - 1)
FROM duplicates d
WHERE b.id = d.id AND d.rn > 1;

-- Make slug NOT NULL after populating existing rows
ALTER TABLE public.businesses
ALTER COLUMN slug SET NOT NULL;

-- Add comment explaining the column
COMMENT ON COLUMN public.businesses.slug IS 'URL-friendly unique identifier for public access';

-- Drop existing restrictive SELECT policies if they exist (to avoid conflicts)
-- Then create permissive public read policies

-- For businesses: Allow public read access
DROP POLICY IF EXISTS "Users can view own businesses" ON public.businesses;
DROP POLICY IF EXISTS "Anyone can read business by slug" ON public.businesses;

-- Create policy that allows owners full access AND public read access
CREATE POLICY "Public can read, owners can manage businesses" ON public.businesses
  FOR SELECT
  USING (true);

-- Recreate owner-only policies for insert/update/delete
CREATE POLICY "Users can insert own businesses" ON public.businesses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own businesses" ON public.businesses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own businesses" ON public.businesses
  FOR DELETE USING (auth.uid() = user_id);

-- For voice_agents: Allow public read access
DROP POLICY IF EXISTS "Users can view own voice agents" ON public.voice_agents;
DROP POLICY IF EXISTS "Anyone can read voice agent by business" ON public.voice_agents;

-- Create policy that allows public read access to voice agents
CREATE POLICY "Public can read voice agents" ON public.voice_agents
  FOR SELECT
  USING (true);

-- Recreate owner-only policies for insert/update/delete on voice_agents
CREATE POLICY "Users can insert own voice agents" ON public.voice_agents
  FOR INSERT WITH CHECK (
    business_id IN (SELECT id FROM public.businesses WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own voice agents" ON public.voice_agents
  FOR UPDATE USING (
    business_id IN (SELECT id FROM public.businesses WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own voice agents" ON public.voice_agents
  FOR DELETE USING (
    business_id IN (SELECT id FROM public.businesses WHERE user_id = auth.uid())
  );
