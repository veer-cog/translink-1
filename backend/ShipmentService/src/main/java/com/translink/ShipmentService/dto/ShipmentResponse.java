package com.translink.ShipmentService.dto;

import com.translink.ShipmentService.model.ShipmentStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ShipmentResponse {
    private String id;
    private String shipmentNumber;
    private double revenue;
    private String clientName;
    private String clientNumber;
    private String originHubId;
    private String destinationHubId;
    private ShipmentStatus status;
    private Double totalWeight;
    private LocalDateTime dispatchedAt;
}