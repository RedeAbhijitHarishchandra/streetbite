package com.streetbite.service;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class FirestoreService {

    public Firestore getFirestore() {
        return FirestoreClient.getFirestore();
    }

    // Real-time Vendor Status
    public void updateVendorLiveStatus(String vendorId, boolean isOnline, boolean isBusy)
            throws ExecutionException, InterruptedException {
        Map<String, Object> status = new HashMap<>();
        status.put("isOnline", isOnline);
        status.put("isBusy", isBusy);
        status.put("lastUpdated", System.currentTimeMillis());

        getFirestore().collection("live_vendor_status").document(vendorId).set(status).get();
    }

    // Real-time Order Updates
    public void updateOrderStatus(String orderId, String status, String eta)
            throws ExecutionException, InterruptedException {
        Map<String, Object> update = new HashMap<>();
        update.put("status", status);
        update.put("eta", eta);
        update.put("lastUpdated", System.currentTimeMillis());

        getFirestore().collection("live_orders").document(orderId).set(update).get();
    }

    // Vendor Location Updates (for live tracking)
    public void updateVendorLocation(String vendorId, double lat, double lng)
            throws ExecutionException, InterruptedException {
        Map<String, Object> location = new HashMap<>();
        location.put("lat", lat);
        location.put("lng", lng);
        location.put("lastUpdated", System.currentTimeMillis());

        getFirestore().collection("vendor_locations").document(vendorId).set(location).get();
    }

    // Notifications
    public void sendNotification(String userId, String message) throws ExecutionException, InterruptedException {
        Map<String, Object> notification = new HashMap<>();
        notification.put("userId", userId);
        notification.put("message", message);
        notification.put("timestamp", System.currentTimeMillis());
        notification.put("read", false);

        getFirestore().collection("notifications").add(notification).get();
    }
}
