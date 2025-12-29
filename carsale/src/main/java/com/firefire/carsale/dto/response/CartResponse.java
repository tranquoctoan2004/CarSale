package com.firefire.carsale.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class CartResponse {
    private Integer cartId;
    private List<CartDetailResponse> items;
    private Integer totalItems;
}
