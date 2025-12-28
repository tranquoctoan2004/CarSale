package com.firefire.carsale.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.firefire.carsale.entity.enums.CarStatus;

import lombok.Data;

@Data
public class CarResponse {
    private Integer carId;
    private String carName;
    private String brand;
    private BigDecimal price;
    private String description;
    private String imageUrl;
    private CarStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
