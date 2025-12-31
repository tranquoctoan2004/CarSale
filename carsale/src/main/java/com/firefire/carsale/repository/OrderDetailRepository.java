package com.firefire.carsale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.firefire.carsale.dto.response.BestSellingCarDTO;
import com.firefire.carsale.entity.OrderDetail;
import com.firefire.carsale.entity.enums.OrderStatus;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {

    List<OrderDetail> findByOrderOrderId(Integer orderId);

    List<OrderDetail> findByCarCarId(Integer carId);

    @Query("SELECT od FROM OrderDetail od WHERE od.order.account.accountId = :accountId")
    List<OrderDetail> findByAccountId(@Param("accountId") Integer accountId);

    @Query("""
                SELECT new com.firefire.carsale.dto.response.BestSellingCarDTO(
                    od.car.carId,
                    od.car.carName,
                    SUM(od.quantity)
                )
                FROM OrderDetail od
                JOIN od.order o
                WHERE o.orderStatus = :status
                GROUP BY od.car.carId, od.car.carName
                ORDER BY SUM(od.quantity) DESC
            """)
    List<BestSellingCarDTO> findBestSellingCars(
            @Param("status") OrderStatus status);
}
