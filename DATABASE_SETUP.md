# MySQL Database Setup Guide

This guide provides step-by-step instructions for setting up MySQL database for the StreetBite application.

## Prerequisites

- MySQL 8.0 or higher installed on your system
- MySQL service running (MySQL80)

## Quick Setup

### 1. Verify MySQL Service

Check if MySQL service is running:

```powershell
Get-Service -Name MySQL80
```

If not running, start it:

```powershell
Start-Service -Name MySQL80
```

### 2. Create Database

Use MySQL Workbench or command line to create the database:

#### Option A: Using MySQL Command Line

```powershell
# Using full path (MySQL not in PATH)
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p

# Then execute:
CREATE DATABASE IF NOT EXISTS streetbite 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

# Verify database creation
SHOW DATABASES LIKE 'streetbite';
```

#### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server (root@localhost)
3. Execute the following SQL:

```sql
CREATE DATABASE IF NOT EXISTS streetbite 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

### 3. Configure Database User (Optional but Recommended)

For better security, create a dedicated user:

```sql
-- Create user
CREATE USER IF NOT EXISTS 'streetbite_user'@'localhost' 
IDENTIFIED BY 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON streetbite.* TO 'streetbite_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;
```

Then update `application.properties`:

```properties
spring.datasource.username=streetbite_user
spring.datasource.password=your_secure_password
```

### 4. Verify Spring Boot Connection

The Spring Boot application will automatically create tables using JPA/Hibernate when you start it.

Run the application:

```powershell
cd backend
mvn spring-boot:run
```

Expected log output:
- ✅ HikariCP connection pool initialized
- ✅ Hibernate schema update started
- ✅ Tables created successfully
- ✅ Application started on port 8080

## Database Schema

The application uses Hibernate's `ddl-auto=update` strategy, which means:
- Tables will be automatically created on first run
- Schema will be updated when entities change
- Existing data will be preserved

### Main Tables

The following tables will be created automatically:

- `users` - User accounts and authentication
- `vendors` - Street food vendor information
- `menu_items` - Vendor menu items
- `orders` - Customer orders
- `order_items` - Individual items in orders
- `reviews` - Vendor reviews
- `review_images` - Review image attachments
- `vendor_images` - Vendor gallery images
- `promotions` - Vendor promotions and deals
- `geocode_cache` - Cached geocoding results
- `user_favorites` - User favorite vendors (many-to-many join table)

## Troubleshooting

### Connection Refused

**Problem**: Application can't connect to MySQL

**Solutions**:
1. Verify MySQL service is running:
   ```powershell
   Get-Service MySQL80
   ```
   
2. Check MySQL is listening on port 3306:
   ```powershell
   netstat -an | findstr "3306"
   ```

3. Verify credentials in `application.properties`

### Authentication Failed

**Problem**: Access denied for user

**Solutions**:
1. Verify username and password in `application.properties`
2. Check user privileges:
   ```sql
   SHOW GRANTS FOR 'root'@'localhost';
   ```

3. If using `allowPublicKeyRetrieval=true`, ensure SSL is disabled or properly configured

### Tables Not Created

**Problem**: Tables don't appear in the database

**Solutions**:
1. Check `spring.jpa.hibernate.ddl-auto` is set to `update` or `create`
2. Review application startup logs for errors
3. Verify entity classes have `@Entity` annotations
4. Check for SQL errors in logs (with `spring.jpa.show-sql=true`)

### Timezone Issues

**Problem**: Incorrect timestamp values

**Solution**: The connection string includes `serverTimezone=UTC` which should handle this. If issues persist:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/streetbite?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=Asia/Kolkata&allowPublicKeyRetrieval=true
```

## Environment Variables (Production)

For production deployment, use environment variables instead of hardcoded credentials:

```properties
spring.datasource.url=${DATABASE_URL:jdbc:mysql://localhost:3306/streetbite?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true}
spring.datasource.username=${DATABASE_USERNAME:root}
spring.datasource.password=${DATABASE_PASSWORD:root}
```

Then set environment variables:

```powershell
$env:DATABASE_URL="jdbc:mysql://your-host:3306/streetbite?useSSL=true&serverTimezone=UTC"
$env:DATABASE_USERNAME="streetbite_user"
$env:DATABASE_PASSWORD="secure_password"
```

## Verify Database Setup

After starting the application, verify the setup:

```sql
USE streetbite;

-- Check if tables exist
SHOW TABLES;

-- View table structure
DESCRIBE users;
DESCRIBE vendors;

-- Check foreign key relationships
SELECT 
  TABLE_NAME,
  COLUMN_NAME,
  CONSTRAINT_NAME,
  REFERENCED_TABLE_NAME,
  REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'streetbite'
AND REFERENCED_TABLE_NAME IS NOT NULL;
```

## Next Steps

1. ✅ Database created
2. ✅ Spring Boot configured
3. ▶️ Start the application with `mvn spring-boot:run`
4. ▶️ Tables will be auto-created
5. ▶️ Test API endpoints to verify connectivity
