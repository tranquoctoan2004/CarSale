package com.firefire.carsale.dto.request;

import com.firefire.carsale.entity.enums.PaymentMethod;

import lombok.Data;

@Data
public class CreateOrderRequest {
    private PaymentMethod paymentMethod;
    private String deliveryAddress;
    private String phoneNumber;
    private String note;
}
