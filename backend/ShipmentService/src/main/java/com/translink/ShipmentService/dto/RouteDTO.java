package com.translink.ShipmentService.dto;

import lombok.Data;
import java.util.List;

@Data
public class RouteDTO {
    private String id;
    private String vehicleID;
    private Float totalDistance;
    private Double totalDuration;
    private String stops;
}