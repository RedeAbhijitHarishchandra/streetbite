package com.streetbite.controller;

import com.streetbite.model.AnalyticsEvent;
import com.streetbite.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*") // For development
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @Autowired
    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @PostMapping("/event")
    public ResponseEntity<?> logEvent(@RequestBody AnalyticsEvent event) {
        try {
            analyticsService.logEvent(event.getVendorId(), event.getEventType(), event.getUserId(), event.getItemId());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<?> getVendorAnalytics(@PathVariable Long vendorId) {
        try {
            Map<String, Object> analytics = analyticsService.getVendorAnalytics(vendorId);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
