package com.translink.ShipmentService.client;


import com.translink.ShipmentService.config.FeignClientInterceptor;
import com.translink.ShipmentService.dto.VehicleDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "vehicle-service", configuration = FeignClientInterceptor.class)
public interface VehicleClient {

    @GetMapping("/vehicles/{id}")
    VehicleDTO getVehicleById(@PathVariable("id") Long id);

    // Add any other methods for the same service here
    @GetMapping("/maintenance/logs")
    List<Object> getMaintenanceLogs(@RequestParam Long vehicleId);
}