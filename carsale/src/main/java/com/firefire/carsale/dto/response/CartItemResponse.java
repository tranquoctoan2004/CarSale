package com.firefire.carsale.dto.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CartItemResponse {
    private Integer carId;
    private String carName;
    private BigDecimal price;
    private Integer quantity;
}
