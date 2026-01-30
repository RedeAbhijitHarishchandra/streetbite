package com.streetbite.controller;

import com.streetbite.model.Review;
import com.streetbite.service.ReviewService;
import com.streetbite.service.VendorStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private VendorStatsService vendorStatsService;

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<Review>> getVendorReviews(@PathVariable Long vendorId) {
        return ResponseEntity.ok(reviewService.getReviewsByVendor(vendorId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getUserReviews(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getReviewsByUser(userId));
    }

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody Review review) {
        try {
            Review savedReview = reviewService.saveReview(review);

            // Update vendor statistics after review is created
            if (savedReview.getVendor() != null && savedReview.getVendor().getId() != null) {
                vendorStatsService.updateVendorStats(savedReview.getVendor().getId());
            }

            return ResponseEntity.ok(savedReview);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReview(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        try {
            Optional<Review> existingReview = reviewService.getReviewById(id);
            if (existingReview.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Review not found"));
            }

            Review review = existingReview.get();

            // Verify ownership (userId must match)
            Long requestUserId = updates.get("userId") != null
                    ? Long.valueOf(updates.get("userId").toString())
                    : null;

            if (requestUserId == null || !review.getUser().getId().equals(requestUserId)) {
                return ResponseEntity.status(403).body(Map.of("error", "You can only edit your own reviews"));
            }

            // Update fields
            if (updates.containsKey("rating")) {
                review.setRating(Integer.valueOf(updates.get("rating").toString()));
            }
            if (updates.containsKey("comment")) {
                review.setComment(updates.get("comment").toString());
            }

            Review updatedReview = reviewService.saveReview(review);

            // Update vendor statistics
            if (review.getVendor() != null && review.getVendor().getId() != null) {
                vendorStatsService.updateVendorStats(review.getVendor().getId());
            }

            return ResponseEntity.ok(updatedReview);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id, @RequestParam Long userId) {
        try {
            Optional<Review> existingReview = reviewService.getReviewById(id);
            if (existingReview.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "Review not found"));
            }

            Review review = existingReview.get();
            Long vendorId = review.getVendor() != null ? review.getVendor().getId() : null;

            // Verify ownership (userId must match)
            if (!review.getUser().getId().equals(userId)) {
                return ResponseEntity.status(403).body(Map.of("error", "You can only delete your own reviews"));
            }

            reviewService.deleteReview(id);

            // Update vendor statistics after deletion
            if (vendorId != null) {
                vendorStatsService.updateVendorStats(vendorId);
            }

            return ResponseEntity.ok(Map.of("success", true, "message", "Review deleted successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
