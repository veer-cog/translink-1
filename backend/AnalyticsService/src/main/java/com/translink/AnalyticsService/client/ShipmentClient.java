package com.translink.AnalyticsService.client;

import com.translink.AnalyticsService.dto.ShipmentDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@FeignClient(name = "ShipmentService") 
public interface ShipmentClient {

    @GetMapping("/shipments")
    List<ShipmentDTO> getShipments();
}