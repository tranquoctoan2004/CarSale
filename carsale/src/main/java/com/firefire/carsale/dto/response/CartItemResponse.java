package com.firefire.carsale.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemResponse {
    private Integer carId;
    private String carName;
    private BigDecimal price;
    private Integer quantity;
}
