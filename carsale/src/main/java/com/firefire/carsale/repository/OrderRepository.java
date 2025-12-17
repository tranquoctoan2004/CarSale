package com.firefire.carsale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.firefire.carsale.entity.Order;
import com.firefire.carsale.entity.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByAccountAccountId(Integer accountId);
    List<Order> findByOrderStatus(OrderStatus status);
    
    @Query("SELECT o FROM Order o WHERE " +
           "(:accountId IS NULL OR o.account.accountId = :accountId) AND " +
           "(:status IS NULL OR o.orderStatus = :status) AND " +
           "(:startDate IS NULL OR o.orderDate >= :startDate) AND " +
           "(:endDate IS NULL OR o.orderDate <= :endDate)")
    List<Order> searchOrders(@Param("accountId") Integer accountId,
                            @Param("status") OrderStatus status,
                            @Param("startDate") LocalDateTime startDate,
                            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.orderStatus = 'completed'")
    BigDecimal getTotalRevenue();
}
