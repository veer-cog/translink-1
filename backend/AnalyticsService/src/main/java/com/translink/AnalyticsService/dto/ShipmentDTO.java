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
public class ShipmentDTO {
    private String id;
    private String shipmentNumber;
    private Double revenue;
    private String status;
    private LocalDateTime dispatchedAt;
    
    // Fields to map from teammate's Shipment Service
    private String originHubId;      
    private String destinationHubId; 

    // Fields used for cost calculations in your logic
    private Double fuelCost; 
    private Double laborCost;
}