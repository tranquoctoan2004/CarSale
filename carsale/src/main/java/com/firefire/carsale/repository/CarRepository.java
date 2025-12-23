package com.firefire.carsale.repository;

import com.firefire.carsale.entity.Car;
import com.firefire.carsale.entity.enums.CarStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CarRepository extends JpaRepository<Car, Integer> {

    // Search theo tên hoặc brand
    @Query("""
                SELECT c FROM Car c
                WHERE LOWER(c.carName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(c.brand) LIKE LOWER(CONCAT('%', :keyword, '%'))
            """)
    List<Car> search(String keyword);

    List<Car> findByStatus(CarStatus status);
}
