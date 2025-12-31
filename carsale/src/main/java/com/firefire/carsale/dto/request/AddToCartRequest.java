package com.firefire.carsale.dto.request;

import lombok.Data;

@Data
public class AddToCartRequest {
    private Integer carId;
    private Integer quantity;
}
