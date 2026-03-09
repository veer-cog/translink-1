package com.translink.AnalyticsService.client;

import com.translink.AnalyticsService.dto.MaintDTO;
import com.translink.AnalyticsService.dto.VehicleDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;

@FeignClient(name = "vehicle-service")
public interface VehicleMaintClient {

    @GetMapping("/vehicles")
    List<VehicleDTO> getVehicles(@RequestParam(required = false) String status);

    @GetMapping("/maintenance")
    List<MaintDTO> getLogs();
}