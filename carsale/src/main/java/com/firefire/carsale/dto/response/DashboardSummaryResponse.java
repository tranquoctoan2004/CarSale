package com.firefire.carsale.dto.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class DashboardSummaryResponse {
    private Long totalUsers;
    private Long totalOrders;
    private BigDecimal totalRevenue;
}
