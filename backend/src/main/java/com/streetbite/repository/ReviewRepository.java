package com.streetbite.repository;

import com.streetbite.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByVendorId(Long vendorId);

    List<Review> findByUserId(Long userId);
}
