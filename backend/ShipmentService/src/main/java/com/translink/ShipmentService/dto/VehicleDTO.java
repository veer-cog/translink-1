package com.translink.ShipmentService.dto;

import lombok.Data;

@Data
public class VehicleDTO {
    private Long id;
    private String numberPlate;
    private String status; // We check if it's "Active"
    private String type;
}