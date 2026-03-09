package com.translink.AnalyticsService.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrendDataDTO {
    private String month;
    private Double revenue;
    
    @Builder.Default
    private Double cost = 0.0; // Sets default value if not provided in builder
}