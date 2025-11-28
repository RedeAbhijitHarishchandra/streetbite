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
public class VendorController {

    @Autowired
    private VendorService vendorService;

    @Autowired
    private com.streetbite.service.VendorSearchService vendorSearchService;

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
                    if (vendorUpdates.getLatitude() != null)
                        existingVendor.setLatitude(vendorUpdates.getLatitude());
                    if (vendorUpdates.getLongitude() != null)
                        existingVendor.setLongitude(vendorUpdates.getLongitude());
                    if (vendorUpdates.getHours() != null)
                        existingVendor.setHours(vendorUpdates.getHours());

                    Vendor updated = vendorService.saveVendor(existingVendor);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
