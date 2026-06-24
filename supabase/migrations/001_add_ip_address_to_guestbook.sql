-- Add ip_address column to guestbook table
ALTER TABLE guestbook ADD COLUMN ip_address TEXT;

-- Create an index on ip_address and created_at for faster queries
CREATE INDEX guestbook_ip_created_at_idx ON guestbook(ip_address, created_at DESC);

-- Set default for existing rows (optional, can be null)
UPDATE guestbook SET ip_address = 'unknown' WHERE ip_address IS NULL;
