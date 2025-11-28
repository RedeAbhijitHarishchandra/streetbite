import { db } from './firebase';
import { FIREBASE_COLLECTIONS } from './firebase-collections';
import {
    collection,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    onSnapshot,
    Unsubscribe,
    DocumentData,
    Timestamp
} from 'firebase/firestore';

/**
 * Type Definitions for Firebase Real-Time Data
 */

export interface LiveVendorStatus {
    vendorId: string; // Matches MySQL vendor.id
    isOnline: boolean;
    isAcceptingOrders: boolean;
    status: 'free' | 'busy' | 'offline';
    updatedAt: Timestamp;
}

export interface LiveMenuUpdate {
    menuItemId: string; // Matches MySQL menu_items.id
    isAvailable: boolean;
    specialPrice?: number;
    updatedAt: Timestamp;
}

export interface LiveOrder {
    orderId: string; // Matches MySQL orders.id
    status: 'placed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
    estimatedReadyTime?: Timestamp;
    updatedAt: Timestamp;
}

export interface VendorLocation {
    vendorId: string; // Matches MySQL vendor.id
    latitude: number;
    longitude: number;
    updatedAt: Timestamp;
}

export interface Notification {
    userId: string; // Matches MySQL users.id
    message: string;
    timestamp: Timestamp;
    read: boolean;
    type?: 'order' | 'promotion' | 'system';
}

/**
 * Firestore Service - Type-safe real-time data operations
 * 
 * IMPORTANT: This service is ONLY for real-time data.
 * For persistent data (users, vendors, menu, reviews, orders), use lib/api.ts
 */
export class FirestoreService {
    /**
     * Live Vendor Status Operations
     */
    static async updateVendorStatus(vendorId: string, status: Partial<LiveVendorStatus>) {
        if (!db) throw new Error('Firestore not initialized');

        const docRef = doc(db, FIREBASE_COLLECTIONS.LIVE_VENDOR_STATUS, vendorId);
        await setDoc(docRef, {
            vendorId,
            ...status,
            updatedAt: Timestamp.now(),
        }, { merge: true });
    }

    static subscribeToVendorStatus(
        vendorId: string,
        callback: (status: LiveVendorStatus | null) => void
    ): Unsubscribe {
        if (!db) throw new Error('Firestore not initialized');

        const docRef = doc(db, FIREBASE_COLLECTIONS.LIVE_VENDOR_STATUS, vendorId);
        return onSnapshot(docRef, (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.data() as LiveVendorStatus);
            } else {
                callback(null);
            }
        });
    }

    /**
     * Live Menu Updates Operations
     */
    static async updateMenuItemAvailability(
        menuItemId: string,
        isAvailable: boolean,
        specialPrice?: number
    ) {
        if (!db) throw new Error('Firestore not initialized');

        const docRef = doc(db, FIREBASE_COLLECTIONS.LIVE_MENU_UPDATES, menuItemId);
        await setDoc(docRef, {
            menuItemId,
            isAvailable,
            specialPrice,
            updatedAt: Timestamp.now(),
        }, { merge: true });
    }

    static subscribeToMenuItemUpdates(
        menuItemId: string,
        callback: (update: LiveMenuUpdate | null) => void
    ): Unsubscribe {
        if (!db) throw new Error('Firestore not initialized');

        const docRef = doc(db, FIREBASE_COLLECTIONS.LIVE_MENU_UPDATES, menuItemId);
        return onSnapshot(docRef, (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.data() as LiveMenuUpdate);
            } else {
                callback(null);
            }
        });
    }

    /**
     * Live Order Status Operations
     */
    static async updateOrderStatus(
        orderId: string,
        status: LiveOrder['status'],
        estimatedReadyTime?: Date
    ) {
        if (!db) throw new Error('Firestore not initialized');

        const docRef = doc(db, FIREBASE_COLLECTIONS.LIVE_ORDERS, orderId);
        await setDoc(docRef, {
            orderId,
            status,
            estimatedReadyTime: estimatedReadyTime ? Timestamp.fromDate(estimatedReadyTime) : null,
            updatedAt: Timestamp.now(),
        }, { merge: true });
    }

    static subscribeToOrderStatus(
        orderId: string,
        callback: (order: LiveOrder | null) => void
    ): Unsubscribe {
        if (!db) throw new Error('Firestore not initialized');

        const docRef = doc(db, FIREBASE_COLLECTIONS.LIVE_ORDERS, orderId);
        return onSnapshot(docRef, (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.data() as LiveOrder);
            } else {
                callback(null);
            }
        });
    }

    /**
     * Vendor Location Operations
     */
    static async updateVendorLocation(
        vendorId: string,
        latitude: number,
        longitude: number
    ) {
        if (!db) throw new Error('Firestore not initialized');

        const docRef = doc(db, FIREBASE_COLLECTIONS.VENDOR_LOCATION, vendorId);
        await setDoc(docRef, {
            vendorId,
            latitude,
            longitude,
            updatedAt: Timestamp.now(),
        });
    }

    static subscribeToVendorLocation(
        vendorId: string,
        callback: (location: VendorLocation | null) => void
    ): Unsubscribe {
        if (!db) throw new Error('Firestore not initialized');

        const docRef = doc(db, FIREBASE_COLLECTIONS.VENDOR_LOCATION, vendorId);
        return onSnapshot(docRef, (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.data() as VendorLocation);
            } else {
                callback(null);
            }
        });
    }

    /**
     * Notifications Operations
     */
    static async sendNotification(
        userId: string,
        message: string,
        type: Notification['type'] = 'system'
    ) {
        if (!db) throw new Error('Firestore not initialized');

        const notifRef = doc(collection(db, FIREBASE_COLLECTIONS.NOTIFICATIONS, userId, 'messages'));
        await setDoc(notifRef, {
            userId,
            message,
            type,
            read: false,
            timestamp: Timestamp.now(),
        });
    }

    static subscribeToUserNotifications(
        userId: string,
        callback: (notifications: Notification[]) => void
    ): Unsubscribe {
        if (!db) throw new Error('Firestore not initialized');

        const notifCollection = collection(db, FIREBASE_COLLECTIONS.NOTIFICATIONS, userId, 'messages');
        return onSnapshot(notifCollection, (snapshot) => {
            const notifications = snapshot.docs.map(doc => doc.data() as Notification);
            callback(notifications);
        });
    }

    static async markNotificationAsRead(userId: string, notificationId: string) {
        if (!db) throw new Error('Firestore not initialized');

        const notifRef = doc(db, FIREBASE_COLLECTIONS.NOTIFICATIONS, userId, 'messages', notificationId);
        await updateDoc(notifRef, { read: true });
    }
}
