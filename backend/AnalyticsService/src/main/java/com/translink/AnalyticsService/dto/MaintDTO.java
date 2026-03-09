package com.translink.AnalyticsService.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MaintDTO {
    private Long id;            //
    private String serviceType; //
    private String status;      //
    private Double cost;        //
    private LocalDateTime timestamp; //
}