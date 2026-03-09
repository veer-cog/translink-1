package com.translink.RouteService.client;

import com.translink.RouteService.config.FeignClientInterceptor;
import com.translink.RouteService.dto.HubDTO;
import com.translink.RouteService.dto.VehicleDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Collections;
import java.util.List;

@FeignClient(
        name = "vehicle-service",
        configuration = FeignClientInterceptor.class,
        fallback = VehicleClientFallback.class ,// Define fallback here
        contextId = "vehicleServiceComplianceClient"
)
public interface VehicleClient {
    @GetMapping("/vehicles/{id}")
    VehicleDTO getVehicleById(@PathVariable("id") String id);

    @GetMapping("/hubs")
    List<HubDTO> getAllHubs();
}

@Component
@Slf4j
class VehicleClientFallback implements VehicleClient {
    @Override
    public VehicleDTO getVehicleById(String id) {
        log.error("Vehicle Service is down! Returning empty vehicle.");
        return new VehicleDTO(); // Or throw a custom "Service Unavailable" exception
    }

    @Override
    public List<HubDTO> getAllHubs() {
        log.error("Vehicle Service is down! Returning empty hub list.");
        return Collections.emptyList();
    }
}