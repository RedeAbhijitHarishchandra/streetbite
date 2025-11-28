package com.streetbite.controller;

import com.streetbite.model.Promotion;
import com.streetbite.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    @PostMapping
    public ResponseEntity<?> createPromotion(@RequestBody Promotion promotion) {
        try {
            Promotion savedPromotion = promotionService.savePromotion(promotion);
            return ResponseEntity.ok(savedPromotion);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<Promotion>> getVendorPromotions(@PathVariable Long vendorId) {
        return ResponseEntity.ok(promotionService.getPromotionsByVendor(vendorId));
    }

    @GetMapping("/vendor/{vendorId}/active")
    public ResponseEntity<List<Promotion>> getActiveVendorPromotions(@PathVariable Long vendorId) {
        return ResponseEntity.ok(promotionService.getActivePromotionsByVendor(vendorId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Promotion>> getAllPromotions() {
        return ResponseEntity.ok(promotionService.getAllPromotions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPromotion(@PathVariable Long id) {
        return promotionService.getPromotionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePromotion(@PathVariable Long id, @RequestBody Promotion promotionUpdates) {
        return promotionService.getPromotionById(id)
                .map(existingPromotion -> {
                    if (promotionUpdates.getTitle() != null)
                        existingPromotion.setTitle(promotionUpdates.getTitle());
                    if (promotionUpdates.getDescription() != null)
                        existingPromotion.setDescription(promotionUpdates.getDescription());
                    if (promotionUpdates.getDiscountType() != null)
                        existingPromotion.setDiscountType(promotionUpdates.getDiscountType());
                    if (promotionUpdates.getDiscountValue() != null)
                        existingPromotion.setDiscountValue(promotionUpdates.getDiscountValue());
                    if (promotionUpdates.getStartDate() != null)
                        existingPromotion.setStartDate(promotionUpdates.getStartDate());
                    if (promotionUpdates.getEndDate() != null)
                        existingPromotion.setEndDate(promotionUpdates.getEndDate());
                    if (promotionUpdates.isActive() != existingPromotion.isActive())
                        existingPromotion.setActive(promotionUpdates.isActive());

                    Promotion saved = promotionService.savePromotion(existingPromotion);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePromotion(@PathVariable Long id) {
        try {
            promotionService.deletePromotion(id);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
