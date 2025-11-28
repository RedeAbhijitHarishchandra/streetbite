'use client';

import { useState, useEffect } from 'react';

// Import the actual LiveVendorStatus type from firestore-service
import type { LiveVendorStatus } from '@/lib/firestore-service';
import type { Unsubscribe } from 'firebase/firestore';

// Type definitions for Firebase services
type FirestoreServiceType = {
    subscribeToVendorStatus: (vendorId: string, callback: (status: LiveVendorStatus | null) => void) => Unsubscribe;
} | null;

// Use the actual LiveVendorStatus type from firestore-service
export type VendorStatus = LiveVendorStatus | null;

// Make Firebase imports optional with proper typing
let FirestoreService: FirestoreServiceType = null;

// Feature flag to check if Firebase is enabled
const isFirebaseEnabled = process.env.NEXT_PUBLIC_FIREBASE_ENABLED === 'true';

// Track if Firebase has been loaded
let firebaseLoaded = false;

// Dynamically import Firebase only if enabled
if (isFirebaseEnabled && typeof window !== 'undefined' && !firebaseLoaded) {
    firebaseLoaded = true;
    import('@/lib/firestore-service')
        .then((module) => {
            FirestoreService = module.FirestoreService;
        })
        .catch((e) => {
            console.warn('Firebase not configured, vendor status features disabled:', e);
        });
}

/**
 * React Hook for Real-Time Vendor Status
 * 
 * Usage:
 * ```tsx
 * const { status, isLoading } = useVendorStatus(vendorId);
 * 
 * if (status?.isOnline) {
 *   // Show online indicator
 * }
 * ```
 */
export function useVendorStatus(vendorId: string | null) {
    const [status, setStatus] = useState<VendorStatus>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [serviceReady, setServiceReady] = useState(!!FirestoreService);

    // Re-check if service is ready periodically (handles race condition)
    useEffect(() => {
        if (!FirestoreService && isFirebaseEnabled) {
            const checkInterval = setInterval(() => {
                if (FirestoreService) {
                    setServiceReady(true);
                    clearInterval(checkInterval);
                }
            }, 100);

            // Clear after 5 seconds to avoid infinite checking
            const timeout = setTimeout(() => {
                clearInterval(checkInterval);
            }, 5000);

            return () => {
                clearInterval(checkInterval);
                clearTimeout(timeout);
            };
        }
    }, []);

    useEffect(() => {
        // If Firebase is not configured or not ready, just return null status
        if (!FirestoreService || !isFirebaseEnabled || !serviceReady) {
            setIsLoading(false);
            return;
        }

        if (!vendorId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const unsubscribe = FirestoreService.subscribeToVendorStatus(
                vendorId,
                (newStatus: VendorStatus) => {
                    setStatus(newStatus);
                    setIsLoading(false);
                }
            );

            return () => unsubscribe();
        } catch (err) {
            console.warn('Vendor status subscription failed:', err);
            setError(err as Error);
            setIsLoading(false);
        }
    }, [vendorId, serviceReady]);

    return { status, isLoading, error };
}
