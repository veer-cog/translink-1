package com.translink.AnalyticsService.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class RecentLogisticsDTO {
    private String shipmentId; // e.g., "SHP-001"
    private String route;      // e.g., "HUB-01 -> HUB-02"
    private LocalDate date;    // The formatted date
    private String status;     // e.g., "delivered" (lowercase)
    private String cost;       // e.g., "$1,200"
}