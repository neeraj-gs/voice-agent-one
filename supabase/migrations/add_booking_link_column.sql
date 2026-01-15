-- Migration: Add booking_link column to voice_agents table
-- This replaces calcom_link with a generic booking link that supports
-- Calendly, Cal.com, TidyCal, Acuity, and other scheduling services

-- Add booking_link column if it doesn't exist
ALTER TABLE public.voice_agents
ADD COLUMN IF NOT EXISTS booking_link TEXT;

-- Migrate existing calcom_link data to booking_link
UPDATE public.voice_agents
SET booking_link = calcom_link
WHERE booking_link IS NULL AND calcom_link IS NOT NULL;

-- Add comment explaining the column
COMMENT ON COLUMN public.voice_agents.booking_link IS 'Generic booking link for scheduling (Calendly, Cal.com, TidyCal, etc.)';

-- Optional: You can drop calcom_link later after confirming migration is complete
-- ALTER TABLE public.voice_agents DROP COLUMN IF EXISTS calcom_link;
