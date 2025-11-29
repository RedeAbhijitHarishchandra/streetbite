-- Check vendors table structure
SHOW COLUMNS FROM vendors;

-- Count total columns
SELECT COUNT(*) as total_columns FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA='streetbite' AND TABLE_NAME='vendors';

-- List all columns with details
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_KEY,
    COLUMN_DEFAULT,
    EXTRA
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA='streetbite' AND TABLE_NAME='vendors' 
ORDER BY ORDINAL_POSITION;
