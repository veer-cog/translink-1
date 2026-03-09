package com.translink.RouteService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteRequest {
    private String vehicleId;
    private List<String> stopNames; // List of addresses or cities for Google Maps
}