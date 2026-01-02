package com.firefire.carsale.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.firefire.carsale.entity.enums.CarStatus;

@Data
@Builder
public class CarResponse {
    private Integer carId;
    private String carName;
    private String brand;
    private BigDecimal price;
    private String imageUrl;
    private CarStatus status;
    private LocalDateTime createdAt;
    private String description;
}
