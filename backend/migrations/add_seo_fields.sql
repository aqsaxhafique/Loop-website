-- Add SEO fields to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(60),
ADD COLUMN IF NOT EXISTS meta_description VARCHAR(160),
ADD COLUMN IF NOT EXISTS keywords TEXT,
ADD COLUMN IF NOT EXISTS alt_text VARCHAR(125);

-- Add comment for documentation
COMMENT ON COLUMN products.meta_title IS 'SEO meta title (50-60 characters)';
COMMENT ON COLUMN products.meta_description IS 'SEO meta description (150-160 characters)';
COMMENT ON COLUMN products.keywords IS 'SEO keywords/tags (comma-separated)';
COMMENT ON COLUMN products.alt_text IS 'Image alt text for accessibility and SEO';
