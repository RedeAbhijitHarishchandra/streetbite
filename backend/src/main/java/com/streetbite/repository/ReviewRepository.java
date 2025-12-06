package com.streetbite.repository;

import com.streetbite.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByVendorId(Long vendorId);

    List<Review> findByUserId(Long userId);

    void deleteByVendorId(Long vendorId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.vendor.id = :vendorId")
    Double findAverageRatingByVendorId(Long vendorId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.vendor.id = :vendorId")
    Long countByVendorId(Long vendorId);

    long countByCreatedAtAfter(java.time.LocalDateTime date);

    @Query("SELECT AVG(r.rating) FROM Review r")
    Double findAveragePlatformRating();

    @Query("SELECT r.vendor.name, COUNT(r) as reviewCount " +
            "FROM Review r " +
            "GROUP BY r.vendor.name " +
            "ORDER BY reviewCount DESC")
    List<Object[]> findMostReviewedVendors();
}
