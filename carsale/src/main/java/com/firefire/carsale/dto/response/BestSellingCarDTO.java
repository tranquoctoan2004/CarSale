package com.firefire.carsale.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BestSellingCarDTO {
    private Integer carId;
    private String carName;
    private Long totalSold;
}
