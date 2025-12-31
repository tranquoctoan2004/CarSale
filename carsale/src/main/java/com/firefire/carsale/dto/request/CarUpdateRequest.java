package com.firefire.carsale.dto.request;

import lombok.Data;
import java.math.BigDecimal;
import com.firefire.carsale.entity.enums.CarStatus;

@Data
public class CarUpdateRequest {
    private String carName;
    private String brand;
    private BigDecimal price;
    private String description;
    private String imageUrl;
    private CarStatus status;
}
