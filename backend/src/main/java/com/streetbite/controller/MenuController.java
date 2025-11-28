package com.streetbite.controller;

import com.streetbite.model.MenuItem;
import com.streetbite.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    @Autowired
    private MenuService menuService;

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<MenuItem>> getMenuByVendor(@PathVariable Long vendorId) {
        return ResponseEntity.ok(menuService.getMenuByVendor(vendorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMenuItem(@PathVariable Long id) {
        return menuService.getMenuItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createMenuItem(@RequestBody MenuItem menuItem) {
        try {
            MenuItem savedItem = menuService.saveMenuItem(menuItem);
            return ResponseEntity.ok(savedItem);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMenuItem(@PathVariable Long id, @RequestBody MenuItem updates) {
        return menuService.getMenuItemById(id)
                .map(existingItem -> {
                    if (updates.getName() != null)
                        existingItem.setName(updates.getName());
                    if (updates.getDescription() != null)
                        existingItem.setDescription(updates.getDescription());
                    if (updates.getPrice() != null)
                        existingItem.setPrice(updates.getPrice());
                    if (updates.getCategory() != null)
                        existingItem.setCategory(updates.getCategory());
                    if (updates.getImageUrl() != null)
                        existingItem.setImageUrl(updates.getImageUrl());
                    existingItem.setAvailable(updates.isAvailable());

                    MenuItem saved = menuService.saveMenuItem(existingItem);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Long id) {
        try {
            menuService.deleteMenuItem(id);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
