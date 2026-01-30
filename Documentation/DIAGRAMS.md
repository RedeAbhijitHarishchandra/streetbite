# StreetBite - Technical Diagrams

## Generated Diagram Images

All diagrams are available in the `diagrams/` folder. These diagrams are optimized for A4 academic reports (High resolution, B&W/Grayscale).

| # | Filename | Description |
|:-:|----------|-------------|
| 1 | `01_usecase.png` | **Use Case Diagram** (All Roles) |
| 2 | `02_activity_customer.png` | **Activity Diagram - Customer** (Comprehensive) |
| 3 | `03_activity_vendor.png` | **Activity Diagram - Vendor** (Comprehensive) |
| 4 | `04_activity_admin.png` | **Activity Diagram - Admin** (Comprehensive) |
| 5 | `05_dfd_level0.png` | **DFD Level 0** (Context Diagram) |
| 6 | `06_dfd_level1.png` | **DFD Level 1** (Comprehensive System Overview) |
| 7 | `07_dfd_level2_core.png` | **DFD Level 2** (Core Business Flow - Search to Review) |
| 8 | `09_seq_customer_journey.png` | **Sequence - Customer** (Complete End-to-End Journey) |
| 9 | `11_seq_vendor_journey.png` | **Sequence - Vendor** (Complete Operations Cycle) |
| 10 | `13_seq_admin_journey.png` | **Sequence - Admin** (Complete Management Cycle) |
| 11 | `14_architecture.png` | **System Architecture** |
| 12 | `15_er_diagram.png` | **ER Diagram** (Database Design) |

---

## Diagram Source Code (Mermaid)

### 1. Use Case Diagram

*(See `diagrams/01_usecase.png`)*

### 2. Activity Diagrams

#### 2.1 Customer Activity

*(See `diagrams/02_activity_customer.png`)*

#### 2.2 Vendor Activity

```mermaid
flowchart TD
    Start((Start)) --> OpenDash[Open Vendor Dashboard]
    OpenDash --> Login[Login with Credentials]
    Login --> Auth{Authentication?}
    Auth -- Failed --> Error[Show Error]
    Error --> Login
    Auth -- Success --> ViewDash[View Dashboard Overview]
    ViewDash --> Action{Select Action?}
    
    Action --> ManageMenu[Manage Menu]
    ManageMenu --> ViewMenu[View Current Menu Items]
    ViewMenu --> MenuAction{Action Type?}
    MenuAction -- Add Item --> EnterItem[Enter Item Details]
    MenuAction -- Edit Item --> SelectEdit[Select Item]
    MenuAction -- Delete Item --> SelectDel[Select Item]
    
    Action --> ManagePromo[Manage Promotions]
    ManagePromo --> ViewPromo[View Active Promotions]
    
    Action --> ViewAnalytics[View Analytics]
    Action --> UpdateProf[Update Profile]
    
    EnterItem --> SaveItem[Save Item]
    SaveItem --> Merge([End])
```

#### 2.3 Admin Activity

```mermaid
flowchart TD
    Start((Start)) --> OpenPanel[Open Admin Panel]
    OpenPanel --> Login[Login as Administrator]
    Login --> Valid{Valid Admin?}
    Valid -- No --> AccessDenied[Access Denied]
    Valid -- Yes --> ViewDash[View Admin Dashboard]
    ViewDash --> Action{Select Action?}
    
    Action --> ManageVendors[Manage Vendors]
    ManageVendors --> ViewVendors[View All Vendors List]
    ViewVendors --> VendorAction{Vendor Action?}
    
    VendorAction -- Approve New --> ReviewApp[Review Application]
    VendorAction -- Suspend --> SelSuspend[Select Vendor]
    
    Action --> ManageUsers[Manage Users]
    Action --> Analytics[View Platform Analytics]
    
    ReviewApp --> Merge([Logout])
    Merge --> EndFinal([End])
```

---

*(Remaining DFD and Sequence diagrams are unchanged)*
