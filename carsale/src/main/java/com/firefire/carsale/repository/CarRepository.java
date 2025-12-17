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

    // Tìm xe theo trạng thái
    List<Car> findByStatus(CarStatus status);

    // Tìm xe theo khoảng giá
    List<Car> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);

    // Tìm xe theo brand
    List<Car> findByBrandContainingIgnoreCase(String brand);

    // Tìm xe theo tên
    List<Car> findByCarNameContainingIgnoreCase(String carName);

    // Lấy xe mới nhất
    List<Car> findTop10ByOrderByCreatedAtDesc();

    // Tìm kiếm tổng hợp
    @Query("SELECT c FROM Car c WHERE " +
            "(:brand IS NULL OR LOWER(c.brand) LIKE LOWER(CONCAT('%', :brand, '%'))) AND " +
            "(:minPrice IS NULL OR c.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR c.price <= :maxPrice) AND " +
            "(:status IS NULL OR c.status = :status)")
    List<Car> searchCars(@Param("brand") String brand,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("status") CarStatus status);
}
