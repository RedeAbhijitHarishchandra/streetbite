package com.streetbite.controller;

import com.streetbite.model.Order;
import com.streetbite.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        try {
            Order savedOrder = orderService.saveOrder(order);
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<Order>> getVendorOrders(@PathVariable Long vendorId) {
        return ResponseEntity.ok(orderService.getOrdersByVendor(vendorId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        return orderService.getOrderById(id)
                .map(order -> {
                    String statusStr = payload.get("status");
                    if (statusStr != null) {
                        try {
                            Order.OrderStatus status = Order.OrderStatus.valueOf(statusStr.toUpperCase());
                            order.setStatus(status);
                            orderService.saveOrder(order);
                            return ResponseEntity.ok(order);
                        } catch (IllegalArgumentException e) {
                            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status"));
                        }
                    }
                    return ResponseEntity.badRequest().body(Map.of("error", "Status is required"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
