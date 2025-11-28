'use client';

import { useState, useEffect } from 'react';
import { FirestoreService, LiveOrder } from '@/lib/firestore-service';

/**
 * React Hook for Real-Time Order Status Tracking
 * 
 * Usage:
 * ```tsx
 * const { order, isLoading } = useOrderStatus(orderId);
 * 
 * // Display: Placed → Preparing → Ready → Completed

 * ```
 */
export function useOrderStatus(orderId: string | null) {
    const [order, setOrder] = useState<LiveOrder | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!orderId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const unsubscribe = FirestoreService.subscribeToOrderStatus(
                orderId,
                (newOrder) => {
                    setOrder(newOrder);
                    setIsLoading(false);
                }
            );

            return () => unsubscribe();
        } catch (err) {
            setError(err as Error);
            setIsLoading(false);
        }
    }, [orderId]);

    return { order, isLoading, error };
}
