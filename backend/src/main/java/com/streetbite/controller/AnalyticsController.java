package com.streetbite.controller;

import com.streetbite.model.MenuItem;
import com.streetbite.model.Order;
import com.streetbite.service.MenuService;
import com.streetbite.service.OrderService;
import com.streetbite.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private VendorService vendorService;

    @Autowired
    private MenuService menuService;

    @Autowired
    private OrderService orderService;

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<?> getVendorAnalytics(@PathVariable Long vendorId) {
        try {
            if (vendorService.getVendorById(vendorId).isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Vendor not found"));
            }

            List<MenuItem> menuItems = menuService.getMenuByVendor(vendorId);
            List<Order> orders = orderService.getOrdersByVendor(vendorId);

            // Calculate analytics
            double totalRevenue = orders.stream()
                    .mapToDouble(order -> order.getTotalAmount().doubleValue())
                    .sum();

            int totalOrders = orders.size();

            // This is a placeholder. Real average rating should come from ReviewService
            double avgRating = 0.0;

            Map<String, Object> analytics = new HashMap<>();
            analytics.put("totalRevenue", totalRevenue);
            analytics.put("totalOrders", totalOrders);
            analytics.put("averageRating", avgRating);
            analytics.put("activeCustomers", Math.max(1, totalOrders / 3)); // Estimate
            analytics.put("menuItemCount", menuItems.size());

            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
