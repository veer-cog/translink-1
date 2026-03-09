package com.translink.RouteService.controller;

import com.translink.RouteService.dto.RouteDTO;
import com.translink.RouteService.dto.RouteRequest;
import com.translink.RouteService.model.Route;
import com.translink.RouteService.service.RouteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;

    /**
     * Creates a new route.
     * Uses identity headers passed from the Gateway.
     */
    @PostMapping
    public ResponseEntity<RouteDTO> createRoute(
            @RequestBody RouteRequest request,
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-Company-Id") String companyId) {

        log.info("[Route] Create request by user {} for company {}", userId, companyId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(routeService.generateRoute(request, userId, companyId));
    }

    /**
     * Gets all routes for the current company.
     */
    @GetMapping
    public ResponseEntity<List<Route>> getAllMyRoutes(
            @RequestParam(required = false) String vehicleId,
            @RequestHeader("X-Company-Id") String companyId) {

        log.info("[Route] Fetching routes for company: {}", companyId);
        return ResponseEntity.ok(routeService.getAllRoutes(vehicleId, companyId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Route> getRoute(@PathVariable String id) {
        return ResponseEntity.ok(routeService.getById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoute(@PathVariable String id,@RequestHeader("X-Company-Id") String companyId) {

        routeService.delete(id,companyId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Updates an existing route.
     */
    @PutMapping("/{id}")
    public ResponseEntity<RouteDTO> updateRoute(
            @PathVariable String id,
            @RequestBody RouteRequest request,
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-Company-Id") String companyId) {

        log.info("[Route] Updating route {} for company {}", id, companyId);
        return ResponseEntity.ok(routeService.updateRoute(id, request, userId, companyId));
    }
}