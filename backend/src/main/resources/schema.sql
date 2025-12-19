-- StreetBite Full Database Schema
-- Automaticaly executed by Spring Boot on startup

-- Set foreign key checks to 0 to facilitate dropping tables
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables
DROP TABLE IF EXISTS search_history;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS review_images;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS user_favorites;
DROP TABLE IF EXISTS promotions;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS vendor_images;
DROP TABLE IF EXISTS vendors;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS geocode_cache;
DROP TABLE IF EXISTS announcements;
DROP TABLE IF EXISTS hot_topics;
DROP TABLE IF EXISTS topic_comments;
DROP TABLE IF EXISTS topic_likes;
DROP TABLE IF EXISTS analytics_events;
DROP TABLE IF EXISTS user_devices;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS TABLE
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    firebase_uid VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    phone_number VARCHAR(50),
    profile_picture VARCHAR(500),
    reset_password_token VARCHAR(255),
    reset_password_token_expiry DATETIME,
    role ENUM('USER', 'VENDOR', 'ADMIN') NOT NULL DEFAULT 'USER',
    zodiac_sign VARCHAR(50),
    xp INT DEFAULT 0,
    level INT DEFAULT 1,
    streak INT DEFAULT 0,
    last_check_in DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_firebase (firebase_uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. VENDORS TABLE
CREATE TABLE vendors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    owner_id BIGINT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cuisine VARCHAR(255),
    address VARCHAR(500),
    latitude DOUBLE,
    longitude DOUBLE,
    rating DOUBLE DEFAULT 0.0,
    review_count INT DEFAULT 0,
    average_rating DOUBLE DEFAULT 0.0,
    phone VARCHAR(50),
    hours VARCHAR(255),
    banner_image_data LONGTEXT,
    display_image_data LONGTEXT,
    is_active BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. VENDOR IMAGES
CREATE TABLE vendor_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. MENU ITEMS
CREATE TABLE menu_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    category VARCHAR(100),
    image_data LONGTEXT,
    is_available BOOLEAN DEFAULT TRUE,
    preparation_time INT,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. REVIEWS
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating INT,
    comment TEXT,
    created_at DATETIME,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. REVIEW IMAGES
CREATE TABLE review_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    review_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. ORDERS
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    vendor_id BIGINT NOT NULL,
    total_amount DECIMAL(10, 2),
    status VARCHAR(50),
    created_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. ORDER ITEMS
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    menu_item_id BIGINT NOT NULL,
    quantity INT,
    price_at_time DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. USER FAVORITES
CREATE TABLE user_favorites (
    user_id BIGINT NOT NULL,
    vendor_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, vendor_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. PROMOTIONS
CREATE TABLE promotions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    promo_code VARCHAR(100) UNIQUE,
    discount_type VARCHAR(50),
    discount_value DECIMAL(10, 2),
    min_order_value DECIMAL(10, 2),
    max_uses INT,
    current_uses INT DEFAULT 0,
    start_date DATETIME,
    end_date DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. GEOCODE CACHE
CREATE TABLE geocode_cache (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    address VARCHAR(500) NOT NULL UNIQUE,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. REPORTS
CREATE TABLE reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporter_id BIGINT,
    reported_id BIGINT,
    type VARCHAR(50),
    category VARCHAR(50),
    subject VARCHAR(255),
    description TEXT,
    email VARCHAR(255),
    role VARCHAR(50),
    reason VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. ANNOUNCEMENTS
CREATE TABLE announcements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(1000) NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. HOT TOPICS
CREATE TABLE hot_topics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME,
    updated_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. TOPIC COMMENTS
CREATE TABLE topic_comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    topic_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME,
    FOREIGN KEY (topic_id) REFERENCES hot_topics(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16. TOPIC LIKES
CREATE TABLE topic_likes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    topic_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at DATETIME,
    UNIQUE KEY (topic_id, user_id),
    FOREIGN KEY (topic_id) REFERENCES hot_topics(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 17. ANALYTICS EVENTS
CREATE TABLE analytics_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    event_type VARCHAR(255),
    event_data TEXT,
    created_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 18. USER DEVICES
CREATE TABLE user_devices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    device_token VARCHAR(255) NOT NULL,
    device_type VARCHAR(50),
    last_active DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
