package com.streetbite.repository;

import com.streetbite.model.AnalyticsEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface AnalyticsRepository extends JpaRepository<AnalyticsEvent, Long> {

    @Query("SELECT COUNT(e) FROM AnalyticsEvent e WHERE e.vendorId = :vendorId AND e.eventType = :eventType AND e.timestamp >= :startDate")
    long countEventsByVendorAndTypeSince(@Param("vendorId") Long vendorId, @Param("eventType") String eventType,
            @Param("startDate") LocalDateTime startDate);

    @Query("SELECT new map(CAST(e.timestamp AS DATE) as date, COUNT(e) as count) FROM AnalyticsEvent e WHERE e.vendorId = :vendorId AND e.eventType = :eventType AND e.timestamp >= :startDate GROUP BY CAST(e.timestamp AS DATE) ORDER BY CAST(e.timestamp AS DATE)")
    List<Map<String, Object>> getDailyEventCounts(@Param("vendorId") Long vendorId,
            @Param("eventType") String eventType, @Param("startDate") LocalDateTime startDate);

    @Query("SELECT e.itemId, COUNT(e) as count FROM AnalyticsEvent e WHERE e.vendorId = :vendorId AND e.eventType = 'CLICK_MENU_ITEM' AND e.timestamp >= :startDate GROUP BY e.itemId ORDER BY count DESC")
    List<Object[]> getTopItems(@Param("vendorId") Long vendorId, @Param("startDate") LocalDateTime startDate);
}
