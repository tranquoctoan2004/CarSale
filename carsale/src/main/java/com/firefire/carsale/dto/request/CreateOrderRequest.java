package com.firefire.carsale.dto.request;

import lombok.Data;

@Data
public class CreateOrderRequest {
    private String paymentMethod;
    private String deliveryAddress;
    private String phoneNumber;
    private String note;
}
