package com.translink.ShipmentService.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ShipmentRequest {
    private String originHubId;
    private String destinationHubId;
    private double revenue;
    private String clientName;
    private String clientNumber;
    private Long vehicleId;
    private Double totalWeight;
    private String description;
    private LocalDateTime estimatedArrival;
}