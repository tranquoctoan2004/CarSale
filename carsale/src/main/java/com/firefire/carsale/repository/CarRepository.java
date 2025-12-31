package com.firefire.carsale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.firefire.carsale.entity.Car;
import com.firefire.carsale.entity.enums.CarStatus;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Integer> {

        List<Car> findByStatus(CarStatus status);

        List<Car> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

        List<Car> findByBrandContainingIgnoreCase(String brand);

        List<Car> findByCarNameContainingIgnoreCase(String carName);

        List<Car> findTop10ByOrderByCreatedAtDesc();

        @Query("""
                            SELECT c FROM Car c
                            WHERE (:brand IS NULL OR LOWER(c.brand) LIKE LOWER(CONCAT('%', :brand, '%')))
                              AND (:carName IS NULL OR LOWER(c.carName) LIKE LOWER(CONCAT('%', :carName, '%')))
                              AND (:minPrice IS NULL OR c.price >= :minPrice)
                              AND (:maxPrice IS NULL OR c.price <= :maxPrice)
                              AND (:status IS NULL OR c.status = :status)
                        """)
        org.springframework.data.domain.Page<Car> searchCars(
                        @Param("brand") String brand,
                        @Param("carName") String carName,
                        @Param("minPrice") BigDecimal minPrice,
                        @Param("maxPrice") BigDecimal maxPrice,
                        @Param("status") CarStatus status,
                        org.springframework.data.domain.Pageable pageable);
}
