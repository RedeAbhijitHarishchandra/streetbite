-- Sample Vendor Data for StreetBite (Simplified)
-- Run this script to populate the database with sample vendors

USE streetbite;

-- Insert sample vendors (without image URLs - let JPA create those columns)
INSERT INTO vendors (name, description, cuisine, address, latitude, longitude, rating, phone, hours, is_active, created_at, updated_at) VALUES
('Mumbai Vada Pav Corner', 'Authentic Mumbai-style vada pav with spicy chutneys and crispy batata vada. A street food classic!', 'Indian', 'FC Road, Pune', 18.5204, 73.8567, 4.5, '+91 98765 43210', 'Mon-Sun: 7:00 AM - 10:00 PM', 1, NOW(), NOW()),
('Puneri Misal House', 'Spicy and delicious Puneri misal with extra farsan and lemon. Perfect for breakfast!', 'Indian', 'Swargate, Pune', 18.5018, 73.8636, 4.7, '+91 98765 43211', 'Mon-Sun: 6:00 AM - 11:00 AM', 1, NOW(), NOW()),
('Chatori Galli Pani Puri', 'Crispy puris filled with tangy tamarind water, spicy mint water, and chickpeas. Irresistible!', 'Indian', 'Camp Area, Pune', 18.5195, 73.8553, 4.3, '+91 98765 43212', 'Mon-Sun: 4:00 PM - 11:00 PM', 1, NOW(), NOW()),
('South Indian Dosa Point', 'Crispy masala dosa, ghee roast, and paper dosa with authentic sambar and coconut chutney.', 'South Indian', 'Kothrud, Pune', 18.5074, 73.8077, 4.6, '+91 98765 43213', 'Mon-Sun: 7:00 AM - 10:00 PM', 1, NOW(), NOW()),
('Beach Style Bhel Puri', 'Mumbai beach-style bhel puri with sev, puffed rice, and tangy chutneys. Light and crispy!', 'Indian', 'Deccan Gymkhana, Pune', 18.5204, 73.8430, 4.4, '+91 98765 43214', 'Mon-Sun: 3:00 PM - 10:00 PM', 1, NOW(), NOW()),
('Kulhad Wali Chai', 'Traditional Indian chai served in earthen kulhads with bun maska and samosas.', 'Beverages', 'Shivaji Nagar, Pune', 18.5304, 73.8490, 4.8, '+91 98765 43215', 'Mon-Sun: 5:00 AM - 11:00 PM', 1, NOW(), NOW()),
('Juhu Style Pav Bhaji', 'Rich and buttery pav bhaji loaded with vegetables and served with soft pav and butter.', 'Indian', 'Kondhwa, Pune', 18.4675, 73.8867, 4.5, '+91 98765 43216', 'Mon-Sun: 5:00 PM - 11:30 PM', 1, NOW(), NOW()),
('Tibetan Momos Hub', 'Steamed and fried momos with spicy chutney. Veg and chicken options available.', 'Asian', 'Hinjewadi, Pune', 18.5912, 73.7389, 4.2, '+91 98765 43217', 'Mon-Sun: 11:00 AM - 10:00 PM', 1, NOW(), NOW()),
('Kolkata Egg Roll Point', 'Authentic Kolkata-style egg rolls with parathas, eggs, onions, and special sauces.', 'Indian', 'Hadapsar, Pune', 18.5089, 73.9260, 4.4, '+91 98765 43218', 'Mon-Sun: 5:00 PM - 12:00 AM', 1, NOW(), NOW()),
('Mumbai Frankie Point', 'Delicious veg and chicken frankies with special mayo and sauces wrapped in soft rotis.', 'Indian', 'Aundh, Pune', 18.5591, 73.8078, 4.6, '+91 98765 43219', 'Mon-Sun: 12:00 PM - 11:00 PM', 1, NOW(), NOW()),
('Delhi Chaat Bhandar', 'Authentic Delhi-style chaat including aloo tikki, papdi chaat, and dahi puri.', 'Indian', 'Baner, Pune', 18.5590, 73.7794, 4.5, '+91 98765 43220', 'Mon-Sun: 4:00 PM - 11:00 PM', 1, NOW(), NOW()),
('Kulfi & Ice Cream Corner', 'Traditional kulfi, flavored ice creams, and sundaes. Perfect for dessert!', 'Desserts', 'Wakad, Pune', 18.5978, 73.7683, 4.3, '+91 98765 43221', 'Mon-Sun: 2:00 PM - 11:00 PM', 1, NOW(), NOW()),
('Fresh Fruit Juice Bar', 'Freshly squeezed fruit juices, smoothies, and milkshakes. No preservatives!', 'Beverages', 'Kalyani Nagar, Pune', 18.5514, 73.9024, 4.7, '+91 98765 43222', 'Mon-Sun: 7:00 AM - 10:00 PM', 1, NOW(), NOW()),
('Bombay Sandwich Corner', 'Grilled vegetable sandwiches with cheese, mint chutney, and special masala.', 'Indian', 'Pimpri, Pune', 18.6298, 73.8131, 4.4, '+91 98765 43223', 'Mon-Sun: 8:00 AM - 11:00 PM', 1, NOW(), NOW()),
('Hyderabadi Biryani Express', 'Authentic Hyderabadi biryani with aromatic rice and tender meat. Served with raita.', 'Indian', 'Magarpatta, Pune', 18.5152, 73.9296, 4.9, '+91 98765 43224', 'Mon-Sun: 11:00 AM - 3:00 PM, 7:00 PM - 11:00 PM', 1, NOW(), NOW());

-- Verify insertion
SELECT COUNT(*) AS total_vendors FROM vendors;
SELECT id, name, cuisine, rating FROM vendors ORDER BY rating DESC;
