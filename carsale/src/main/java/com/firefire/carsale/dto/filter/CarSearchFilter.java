package com.firefire.carsale.dto.filter;

import lombok.Data;
import java.math.BigDecimal;
import com.firefire.carsale.entity.enums.CarStatus;

@Data
public class CarSearchFilter {
    private String brand;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private CarStatus status;
}
