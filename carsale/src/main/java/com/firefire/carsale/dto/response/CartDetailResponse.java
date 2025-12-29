package com.firefire.carsale.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CartDetailResponse {
    private Integer cartDetailId;
    private Integer carId;
    private String carName;
    private Integer quantity;
    private LocalDateTime addedAt;
}
