-- Check if photos table exists
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name LIKE '%photos%' 
ORDER BY table_name, ordinal_position;