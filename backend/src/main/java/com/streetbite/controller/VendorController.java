package com.streetbite.controller;

import com.streetbite.model.Vendor;
import com.streetbite.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:4000" }, allowCredentials = "true")
public class VendorController {

    @Autowired
    private VendorService vendorService;

    @Autowired
    private com.streetbite.service.VendorSearchService vendorSearchService;

    /**
     * Validates if a string is a valid URL
     * 
     * @param url The URL string to validate
     * @return true if valid, false otherwise
     */
    private boolean isValidUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            return false;
        }

        // Check length constraint (2048 is common max URL length)
        if (url.length() > 2048) {
            return false;
        }

        // Allow data URLs for base64 encoded images
        if (url.startsWith("data:image/")) {
            return true;
        }

        // Validate HTTP/HTTPS URLs
        try {
            java.net.URI uri = new java.net.URI(url);
            String protocol = uri.getScheme();
            return "http".equals(protocol) || "https".equals(protocol);
        } catch (java.net.URISyntaxException e) {
            return false;
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Vendor>> searchVendors(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "2000") double radius) {
        return ResponseEntity.ok(vendorSearchService.searchNearby(lat, lng, radius));
    }

    @GetMapping
    public ResponseEntity<List<Vendor>> getAllVendors() {
        return ResponseEntity.ok(vendorService.getAllVendors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVendor(@PathVariable Long id) {
        return vendorService.getVendorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createVendor(@RequestBody Vendor vendor) {
        try {
            // Validate image URLs before creating
            if (vendor.getBannerImageUrl() != null && !isValidUrl(vendor.getBannerImageUrl())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid banner image URL"));
            }
            if (vendor.getDisplayImageUrl() != null && !isValidUrl(vendor.getDisplayImageUrl())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid display image URL"));
            }

            Vendor savedVendor = vendorService.saveVendor(vendor);
            return ResponseEntity.ok(savedVendor);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateVendor(@PathVariable Long id, @RequestBody Vendor vendorUpdates) {
        return vendorService.getVendorById(id)
                .map(existingVendor -> {
                    if (vendorUpdates.getName() != null)
                        existingVendor.setName(vendorUpdates.getName());
                    if (vendorUpdates.getDescription() != null)
                        existingVendor.setDescription(vendorUpdates.getDescription());
                    if (vendorUpdates.getCuisine() != null)
                        existingVendor.setCuisine(vendorUpdates.getCuisine());
                    if (vendorUpdates.getPhone() != null)
                        existingVendor.setPhone(vendorUpdates.getPhone());
                    if (vendorUpdates.getAddress() != null)
                        existingVendor.setAddress(vendorUpdates.getAddress());
                    if (vendorUpdates.getLatitude() != null) {
                        if (vendorUpdates.getLatitude() < -90 || vendorUpdates.getLatitude() > 90) {
                            return ResponseEntity.badRequest()
                                    .body(Map.of("error", "Invalid latitude: must be between -90 and 90"));
                        }
                        existingVendor.setLatitude(vendorUpdates.getLatitude());
                    }
                    if (vendorUpdates.getLongitude() != null) {
                        if (vendorUpdates.getLongitude() < -180 || vendorUpdates.getLongitude() > 180) {
                            return ResponseEntity.badRequest()
                                    .body(Map.of("error", "Invalid longitude: must be between -180 and 180"));
                        }
                        existingVendor.setLongitude(vendorUpdates.getLongitude());
                    }
                    if (vendorUpdates.getHours() != null)
                        existingVendor.setHours(vendorUpdates.getHours());

                    // Validate and update banner image URL
                    if (vendorUpdates.getBannerImageUrl() != null) {
                        if (isValidUrl(vendorUpdates.getBannerImageUrl())) {
                            existingVendor.setBannerImageUrl(vendorUpdates.getBannerImageUrl());
                        } else {
                            return ResponseEntity.badRequest().body(Map.of("error", "Invalid banner image URL"));
                        }
                    }

                    // Validate and update display image URL
                    if (vendorUpdates.getDisplayImageUrl() != null) {
                        if (isValidUrl(vendorUpdates.getDisplayImageUrl())) {
                            existingVendor.setDisplayImageUrl(vendorUpdates.getDisplayImageUrl());
                        } else {
                            return ResponseEntity.badRequest().body(Map.of("error", "Invalid display image URL"));
                        }
                    }

                    Vendor updated = vendorService.saveVendor(existingVendor);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
