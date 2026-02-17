-- Check if partners table exists and its schema
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name LIKE '%partners%' 
ORDER BY table_name, ordinal_position;