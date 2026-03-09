package com.translink.AnalyticsService.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardSummaryDTO {
    private Double totalRevenue;
    private String revenueChangeLabel;
    private Long totalDeliveries;
    private String deliveriesChangeLabel;
    private Double profitMargin;
    private String marginChangeLabel;
    private Double fleetUtilization;
    private String utilizationChangeLabel;
}