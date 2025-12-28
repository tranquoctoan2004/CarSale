package com.firefire.carsale.dto.request;

import java.math.BigDecimal;

import com.firefire.carsale.entity.enums.CarStatus;

import lombok.Data;

@Data
public class CarRequest {
    private String carName;
    private String brand;
    private BigDecimal price;
    private String description;
    private String imageUrl;
    private CarStatus status;
}
