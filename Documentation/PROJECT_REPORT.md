# 🍽️ StreetBite - Project Report

**Project**: StreetBite - Street Food Discovery Platform  
**Document Type**: Technical System Design  
**Date**: October 2024  
**Format**: A4 Professional Print

---

## 1. Project Overview

**StreetBite** is a full-stack street food discovery platform connecting food lovers with local vendors. The system focuses on **discovery and engagement**, allowing users to find vendors, view menus, and share reviews.

### Core Features (Discovery Only)
- **📍 Location-Based Search**: Find vendors using real-time geolocation.
- **🍔 Menu Browsing**: View detailed menus with prices and availability.
- **⭐ Reviews & Ratings**: Community-driven review system.
- **🏪 Vendor Dashboard**: Tools for vendors to manage profiles and menus.
- **📊 Analytics**: Insights on profile views and menu engagement.

> **Note**: This platform is purely for discovery. Order placement and payment processing are out of scope for this version.

---

## 2. System Architecture

### 2.1 Use Case Diagram

The system involves three primary actors: **Customer**, **Vendor**, and **Admin**.

![Use Case Diagram](diagrams/usecase_v2_1769090242173.png)

**Key Use Cases:**
- **Customer**: Search Vendors, View Menu, Write Review, Add Favorites.
- **Vendor**: Manage Profile, Manage Menu, Create Promotions, View Analytics.
- **Admin**: Manage Vendors, Platform Analytics.

---

### 2.2 Activity Diagram - Vendor Discovery Flow

The primary user journey focuses on discovering vendors and engaging with content.

![Activity Diagram](diagrams/activity_diagram_v2_1769090118555.png)

1. **Authentication**: User logs in (optional for basic search).
2. **Discovery**: User enables location -> System finds nearby vendors.
3. **Engagement**: User views details -> writes review or adds to favorites.

---

## 3. Data Flow Diagrams (DFD)

### 3.1 DFD Level 0 - Context Diagram

System interaction with external entities (Users, Google Maps, Email Service).

![DFD Level 0](diagrams/dfd_level0_v2_1769090185474.png)

---

### 3.2 DFD Level 1 - Major Processes

Breakdown of the 7 core system processes:

1. **Authentication**
2. **Vendor Management**
3. **Menu Management**
4. **Review Management**
5. **Promotion Management**
6. **Analytics**
7. **Favorites**

![DFD Level 1](diagrams/dfd_level1_v2_1769090273135.png)

---

### 3.3 DFD Level 2 - Review Management

Detailed flow of the Review Management process (Process 4.0).

![DFD Level 2 - Review](diagrams/dfd_level2_review_1769090331119.png)

---

### 3.4 DFD Level 2 - Authentication

Detailed flow of the Authentication process (Process 1.0).

```mermaid
%%{init: {'theme': 'neutral'}}%%
flowchart TB
    User((User))
    
    subgraph AUTH["Process 1.0: Authentication"]
        P11((1.1 Register))
        P12((1.2 Validate))
        P13((1.3 Hash Password))
        P14((1.4 Authenticate))
        P15((1.5 Generate Token))
        P16((1.6 Request Reset))
        P17((1.7 Reset Password))
    end
    
    D1[(D1: Users)]
    Email[/Email Service/]
    
    User -->|Registration Data| P11
    P11 -->|Input Data| P12
    P12 -->|Valid Data| P13
    P13 -->|Hashed Credentials| D1
    
    User -->|Login Credentials| P14
    P14 <-->|User Lookup| D1
    P14 -->|Authenticated| P15
    P15 -->|JWT Token| User
    
    User -->|Email Address| P16
    P16 <-->|User Lookup| D1
    P16 -->|Reset Link| Email
    Email -->|Email Sent| User
    
    User -->|Token + New Password| P17
    P17 -->|Update| D1
```

---

## 4. Sequence Diagrams

### 4.1 Customer: Vendor Discovery

Interaction flow for finding vendors and viewing menus.

```mermaid
%%{init: {'theme': 'neutral'}}%%
sequenceDiagram
    autonumber
    
    actor Customer
    participant Frontend
    participant Backend
    participant Database

    Customer->>Frontend: Navigate to Explore
    Frontend->>Customer: Request Location
    Customer->>Frontend: Grant Location
    Frontend->>Backend: GET /api/vendors/search
    Backend->>Database: Query nearby vendors
    Database-->>Backend: Vendor list
    Backend-->>Frontend: JSON Response
    Frontend->>Customer: Display vendors on map
    
    Customer->>Frontend: Select vendor
    Frontend->>Backend: GET /api/vendors/{id}
    Backend->>Database: Fetch vendor details
    Database-->>Backend: Vendor data
    Backend-->>Frontend: Vendor info
    Frontend->>Customer: Display vendor profile
    
    Customer->>Frontend: View menu
    Frontend->>Backend: GET /api/menu/vendor/{id}
    Backend->>Database: Fetch menu items
    Database-->>Backend: Menu items
    Backend-->>Frontend: Menu data
    Frontend->>Customer: Display menu
```

---

### 4.2 Customer: Write Review

Flow for submitting a review and updating statistics.

```mermaid
%%{init: {'theme': 'neutral'}}%%
sequenceDiagram
    autonumber
    
    actor Customer
    participant Frontend
    participant Backend
    participant Database

    Customer->>Frontend: Click Write Review
    Frontend->>Customer: Show review form
    Customer->>Frontend: Submit rating and comment
    Frontend->>Backend: POST /api/reviews
    Backend->>Database: Save review
    Database-->>Backend: Review saved
    Backend->>Backend: Calculate new average
    Backend->>Database: Update vendor stats
    Database-->>Backend: Stats updated
    Backend-->>Frontend: Confirmation
    Frontend->>Customer: Show success message
```

---

### 4.3 Vendor: Menu Management

Vendor operations for managing menu items.

```mermaid
%%{init: {'theme': 'neutral'}}%%
sequenceDiagram
    autonumber
    
    actor Vendor
    participant Dashboard
    participant Backend
    participant Database

    Vendor->>Dashboard: Login
    Dashboard->>Backend: POST /api/auth/login
    Backend->>Database: Validate credentials
    Database-->>Backend: Authenticated
    Backend-->>Dashboard: JWT Token
    Dashboard->>Vendor: Show dashboard
    
    Vendor->>Dashboard: Navigate to Menu
    Dashboard->>Backend: GET /api/menu/vendor/{id}
    Backend->>Database: Fetch menu items
    Database-->>Backend: Menu items
    Backend-->>Dashboard: Menu data
    Dashboard->>Vendor: Display menu
    
    Vendor->>Dashboard: Add new item
    Dashboard->>Vendor: Show form
    Vendor->>Dashboard: Submit details
    Dashboard->>Backend: POST /api/menu
    Backend->>Database: Save item
    Database-->>Backend: Item saved
    Backend-->>Dashboard: New item
    Dashboard->>Vendor: Update list
    
    Vendor->>Dashboard: Toggle availability
    Dashboard->>Backend: PUT /api/menu/{id}
    Backend->>Database: Update status
    Database-->>Backend: Updated
    Backend-->>Dashboard: Confirmation
    Dashboard->>Vendor: Show updated status
```

---

---

### 4.4 Vendor: Promotions & Analytics

Vendor operations for managing promotions and viewing analytics.

```mermaid
%%{init: {'theme': 'neutral'}}%%
sequenceDiagram
    autonumber
    
    actor Vendor
    participant Dashboard
    participant Backend
    participant Database

    rect rgb(248, 248, 248)
        Note over Vendor, Database: Promotions Management
        Vendor->>Dashboard: Navigate to Promotions
        Dashboard->>Backend: GET /api/promotions/vendor/{id}
        Backend->>Database: Fetch promotions
        Database-->>Backend: Promotions list
        Backend-->>Dashboard: Promotions data
        Dashboard->>Vendor: Display promotions
        
        Vendor->>Dashboard: Create new promotion
        Dashboard->>Vendor: Show form
        Vendor->>Dashboard: Submit details
        Dashboard->>Backend: POST /api/promotions
        Backend->>Database: Save promotion
        Database-->>Backend: Promotion created
        Backend-->>Dashboard: Confirmation
        Dashboard->>Vendor: Show new promotion
    end

    rect rgb(245, 245, 245)
        Note over Vendor, Database: Analytics
        Vendor->>Dashboard: Navigate to Analytics
        Dashboard->>Backend: GET /api/analytics/vendor/{id}
        Backend->>Database: Aggregate data
        Database-->>Backend: Raw metrics
        Backend-->>Dashboard: Analytics summary
        Dashboard->>Vendor: Display charts
    end
```

---

### 4.5 Admin: Platform Management

Admin operations for managing vendors and viewing insights.

```mermaid
%%{init: {'theme': 'neutral'}}%%
sequenceDiagram
    autonumber
    
    actor Admin
    participant Panel as Admin Panel
    participant Backend
    participant Database

    Admin->>Panel: Login as Admin
    Panel->>Backend: POST /api/auth/login
    Backend->>Database: Validate admin
    Database-->>Backend: Admin verified
    Backend-->>Panel: JWT Token
    Panel->>Admin: Show admin dashboard

    rect rgb(248, 248, 248)
        Note over Admin, Database: Vendor Management
        Admin->>Panel: View all vendors
        Panel->>Backend: GET /api/vendors/all
        Backend->>Database: Fetch vendors
        Database-->>Backend: Vendor list
        Backend-->>Panel: Vendors data
        Panel->>Admin: Display vendor table
        
        Admin->>Panel: Approve/Suspend vendor
        Panel->>Backend: PUT /api/vendors/{id}/status
        Backend->>Database: Update status
        Database-->>Backend: Updated
        Backend-->>Panel: Confirmation
        Panel->>Admin: Refresh list
    end

    rect rgb(245, 245, 245)
        Note over Admin, Database: Platform Analytics
        Admin->>Panel: View analytics
        Panel->>Backend: GET /api/analytics/platform
        Backend->>Database: Aggregate metrics
        Database-->>Backend: Platform data
        Backend-->>Panel: Statistics
        Panel->>Admin: Display dashboard
    end
```

---

## 5. Technology Stack

- **Frontend**: Next.js 16 (React 19), TypeScript, Tailwind CSS
- **Backend**: Spring Boot 3.2.0, Java 17
- **Database**: Firebase Firestore (NoSQL)
- **Services**: Google Maps API (Geocoding), Resend (Email)
- **Hosting**: Vercel (Frontend), Render (Backend)

---

**End of Report**
