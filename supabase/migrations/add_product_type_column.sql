-- Migration: Add product_type column to businesses table
-- This enables businesses to choose between 'website_and_agent' or 'agent_only'

-- Add product_type column with default value
ALTER TABLE public.businesses
ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'website_and_agent';

-- Add constraint to ensure valid values
ALTER TABLE public.businesses
ADD CONSTRAINT businesses_product_type_check
CHECK (product_type IN ('website_and_agent', 'agent_only'));

-- Add comment explaining the column
COMMENT ON COLUMN public.businesses.product_type IS 'Product type: website_and_agent (full landing page + voice agent) or agent_only (just the voice agent for embedding)';

-- Update existing businesses to have the default value (in case any are null)
UPDATE public.businesses
SET product_type = 'website_and_agent'
WHERE product_type IS NULL;
