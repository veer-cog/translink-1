package com.translink.RouteService.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteDTO {
    private String id;
    private String vehicleID;
    private List<StopDTO> stops;
    private Float totalDistance;
    private Double totalDuration;
    private Double totalFuelExpense;

    @Data
    public static class StopDTO {
        private String name;
        private Double lat;
        private Double lng;
    }
}