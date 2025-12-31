package com.firefire.carsale.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.firefire.carsale.entity.enums.OrderStatus;

@Data
public class OrderResponse {
    private Integer orderId;
    private BigDecimal totalPrice;
    private OrderStatus orderStatus;
    private String paymentMethod;
    private LocalDateTime orderDate;
}
