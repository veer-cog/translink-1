package com.translink.ShipmentService.client;

import com.translink.ShipmentService.config.FeignClientInterceptor;
import com.translink.ShipmentService.dto.RouteDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ROUTESERVICE", configuration = FeignClientInterceptor .class)
public interface RouteClient {

    @GetMapping("/routes/{id}")
    RouteDTO getRouteById(@PathVariable("id") String id);
}