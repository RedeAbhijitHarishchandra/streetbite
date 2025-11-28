'use client';

import { useState, useEffect } from 'react';
import { FirestoreService, LiveVendorStatus } from '@/lib/firestore-service';

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
    const [status, setStatus] = useState<LiveVendorStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!vendorId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const unsubscribe = FirestoreService.subscribeToVendorStatus(
                vendorId,
                (newStatus) => {
                    setStatus(newStatus);
                    setIsLoading(false);
                }
            );

            return () => unsubscribe();
        } catch (err) {
            setError(err as Error);
            setIsLoading(false);
        }
    }, [vendorId]);

    return { status, isLoading, error };
}
