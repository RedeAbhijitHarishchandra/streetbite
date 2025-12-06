package com.streetbite.repository;

import com.streetbite.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

    List<Order> findByVendorId(Long vendorId);

    List<Order> findByVendorIdAndStatus(Long vendorId, Order.OrderStatus status);

    void deleteByVendorId(Long vendorId);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.vendor.id = :vendorId")
    Long countByVendorId(Long vendorId);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.vendor.id = :vendorId")
    java.math.BigDecimal sumTotalAmountByVendorId(Long vendorId);

    @Query("SELECT COUNT(DISTINCT o.user.id) FROM Order o WHERE o.vendor.id = :vendorId")
    Long countDistinctUserIdByVendorId(Long vendorId);

    @Query("SELECT SUM(o.totalAmount) FROM Order o")
    java.math.BigDecimal sumTotalAmount();

    List<Order> findByCreatedAtAfter(java.time.LocalDateTime date);

    @Query("SELECT o.vendor.name, SUM(o.totalAmount) as totalRevenue " +
            "FROM Order o " +
            "GROUP BY o.vendor.name " +
            "ORDER BY totalRevenue DESC")
    List<Object[]> findTopVendors();
}
