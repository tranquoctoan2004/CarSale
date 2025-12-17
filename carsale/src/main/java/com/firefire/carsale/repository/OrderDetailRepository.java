package com.firefire.carsale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.firefire.carsale.entity.OrderDetail;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    List<OrderDetail> findByOrderOrderId(Integer orderId);

    List<OrderDetail> findByCarCarId(Integer carId);

    @Query("SELECT od FROM OrderDetail od WHERE od.order.account.accountId = :accountId")
    List<OrderDetail> findByAccountId(@Param("accountId") Integer accountId);

    @Query("SELECT od.car, SUM(od.quantity) as totalSold FROM OrderDetail od " +
            "JOIN od.order o WHERE o.orderStatus = 'completed' " +
            "GROUP BY od.car ORDER BY totalSold DESC")
    List<Object[]> findBestSellingCars();
}