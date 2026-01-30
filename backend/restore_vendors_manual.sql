-- RESTORE VENDORS AND VENDOR_IMAGES TABLES
-- This script reconstructs both vendors and vendor_images tables to ensure the app works.
-- It handles cases where either table was dropped.

USE streetbite;

-- 1. Create the vendors table
CREATE TABLE IF NOT EXISTS vendors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    owner_id BIGINT,
    name VARCHAR(255),
    description TEXT,
    cuisine VARCHAR(255),
    address VARCHAR(255),
    latitude DOUBLE,
    longitude DOUBLE,
    rating DOUBLE,
    review_count INT DEFAULT 0,
    average_rating DOUBLE DEFAULT 0.0,
    phone VARCHAR(255),
    hours VARCHAR(255),
    banner_image_data LONGTEXT,
    display_image_data LONGTEXT,
    is_active BIT(1) DEFAULT 1,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at DATETIME(6),
    updated_at DATETIME(6),
    CONSTRAINT fk_vendor_owner FOREIGN KEY (owner_id) REFERENCES users (id)
);

-- 2. Create the vendor_images table (Critical for EAGER fetch)
CREATE TABLE IF NOT EXISTS vendor_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    CONSTRAINT fk_vendor_images_vendor FOREIGN KEY (vendor_id) REFERENCES vendors (id) ON DELETE CASCADE
);

-- 3. Insert Sample Vendors (Only if table is empty to avoid duplicates)
INSERT INTO vendors (name, description, cuisine, address, latitude, longitude, rating, phone, hours, is_active, created_at, updated_at)
SELECT * FROM (SELECT 
'Mumbai Vada Pav Corner' as name, 'Authentic Mumbai-style vada pav with spicy chutneys and crispy batata vada. A street food classic!' as description, 'Indian' as cuisine, 'FC Road, Pune' as address, 18.5204 as latitude, 73.8567 as longitude, 4.5 as rating, '+91 98765 43210' as phone, 'Mon-Sun: 7:00 AM - 10:00 PM' as hours, 1 as is_active, NOW() as created_at, NOW() as updated_at
) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM vendors WHERE name = 'Mumbai Vada Pav Corner'
) LIMIT 1;

INSERT INTO vendors (name, description, cuisine, address, latitude, longitude, rating, phone, hours, is_active, created_at, updated_at)
SELECT * FROM (SELECT 
'Puneri Misal House', 'Spicy and delicious Puneri misal with extra farsan and lemon. Perfect for breakfast!', 'Indian', 'Swargate, Pune', 18.5018, 73.8636, 4.7, '+91 98765 43211', 'Mon-Sun: 6:00 AM - 11:00 AM', 1, NOW(), NOW()
) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM vendors WHERE name = 'Puneri Misal House'
) LIMIT 1;

INSERT INTO vendors (name, description, cuisine, address, latitude, longitude, rating, phone, hours, is_active, created_at, updated_at)
SELECT * FROM (SELECT 
'Chatori Galli Pani Puri', 'Crispy puris filled with tangy tamarind water, spicy mint water, and chickpeas. Irresistible!', 'Indian', 'Camp Area, Pune', 18.5195, 73.8553, 4.3, '+91 98765 43212', 'Mon-Sun: 4:00 PM - 11:00 PM', 1, NOW(), NOW()
) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM vendors WHERE name = 'Chatori Galli Pani Puri'
) LIMIT 1;

-- Add other vendors similarly if needed, or stick to these 3 for basic restoration to verify fixes.
-- Adding a few more to populate the list well.

INSERT INTO vendors (name, description, cuisine, address, latitude, longitude, rating, phone, hours, is_active, created_at, updated_at)
SELECT * FROM (SELECT 
'South Indian Dosa Point', 'Crispy masala dosa, ghee roast, and paper dosa with authentic sambar and coconut chutney.', 'South Indian', 'Kothrud, Pune', 18.5074, 73.8077, 4.6, '+91 98765 43213', 'Mon-Sun: 7:00 AM - 10:00 PM', 1, NOW(), NOW()
) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM vendors WHERE name = 'South Indian Dosa Point'
) LIMIT 1;

INSERT INTO vendors (name, description, cuisine, address, latitude, longitude, rating, phone, hours, is_active, created_at, updated_at)
SELECT * FROM (SELECT 
'Beach Style Bhel Puri', 'Mumbai beach-style bhel puri with sev, puffed rice, and tangy chutneys. Light and crispy!', 'Indian', 'Deccan Gymkhana, Pune', 18.5204, 73.8430, 4.4, '+91 98765 43214', 'Mon-Sun: 3:00 PM - 10:00 PM', 1, NOW(), NOW()
) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM vendors WHERE name = 'Beach Style Bhel Puri'
) LIMIT 1;

-- 4. Sample Images for the vendors (Optional but good for testing)
-- Assuming IDs 1-5 for the above inserts if table was empty. 
-- In a real restoration, we would fetch IDs dynamically but for simple fix this logic relies on auto-increment usually starting at next available or 1 if empty.

