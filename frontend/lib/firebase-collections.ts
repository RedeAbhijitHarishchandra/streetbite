/**
 * Firebase Collection Names
 * 
 * CRITICAL: These collections are for REAL-TIME data only.
 * All persistent data (users, vendors, menu items, reviews, orders) is stored in MySQL.
 * 
 * Naming Convention:
 * - Real-time status: prefix with 'live_'
 * - Location tracking: suffix with '_location'
 * - User-specific: descriptive names like 'notifications'
 */

export const FIREBASE_COLLECTIONS = {
    /**
     * Live vendor status (online/offline, accepting orders, busy/free)
     * Document ID: vendorId (matches MySQL vendor.id)
     */
    LIVE_VENDOR_STATUS: 'live_vendor_status',

    /**
     * Live menu item updates (availability, special pricing)
     * Document ID: menuItemId (matches MySQL menu_items.id)
     */
    LIVE_MENU_UPDATES: 'live_menu_updates',

    /**
     * Live order status tracking (placed → prepared → ready)
     * Document ID: orderId (matches MySQL orders.id)
     */
    LIVE_ORDERS: 'live_orders',

    /**
     * Live vendor GPS location
     * Document ID: vendorId (matches MySQL vendor.id)
     */
    VENDOR_LOCATION: 'vendor_location',

    /**
     * User notifications (messages, timestamp, read/unread)
     * Document ID: userId (matches MySQL users.id)
     * Subcollection: messages
     */
    NOTIFICATIONS: 'notifications',
} as const;

/**
 * Type-safe collection name type
 */
export type FirebaseCollectionName = typeof FIREBASE_COLLECTIONS[keyof typeof FIREBASE_COLLECTIONS];

/**
 * IMPORTANT: Collections to DELETE from Firebase Console
 * 
 * If any of these exist in your Firestore, DELETE them immediately:
 * - users
 * - vendors
 * - menu_items / menuItems
 * - reviews
 * - orders (the persistent collection, not live_orders)
 * - favorites / user_favorites
 * 
 * These are handled by MySQL and should NOT be in Firebase.
 */
