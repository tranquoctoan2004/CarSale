package com.firefire.carsale.dto.request;

import lombok.Data;
import com.firefire.carsale.entity.enums.OrderStatus;

@Data
public class UpdateOrderStatusRequest {
    private OrderStatus orderStatus;
}
