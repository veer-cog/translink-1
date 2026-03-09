package com.translink.vehicle.controller;

import com.translink.vehicle.model.Vehicle;
import com.translink.vehicle.service.VehicleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/vehicles")
@RequiredArgsConstructor
@Slf4j
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Vehicle> create(
            @RequestBody Vehicle vehicle,
            @RequestHeader("X-Company-Id") String companyId,
            @RequestHeader("X-User-Id") String userId) {

        log.info("[Vehicle] Create request by User: {} for Company: {}", userId, companyId);

        // Ensure the vehicle is owned by the user's company
        vehicle.setCompanyId(companyId);
        vehicle.setCreatedBy(userId);

        return ResponseEntity.ok(vehicleService.save(vehicle));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public List<Vehicle> list(
            @RequestParam(required = false) String status,
            @RequestHeader("X-Company-Id") String companyId) {

        log.info("[Vehicle] Listing vehicles for Company: {} with status filter: {}", companyId, status);

        // Service should now filter results by companyId
        return vehicleService.findAllByCompanyFiltered(companyId, status);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Vehicle> getVehicleByIdforFeign(
            @PathVariable Long id,
            @RequestHeader("X-Company-Id") String companyId) {

        log.info("[Vehicle] Fetching vehicle: {} for company: {}", id, companyId);

        Vehicle vehicle = vehicleService.getVehicleByIdforFeign(id);

        // Security Check: Ensure the vehicle belongs to the requester's company
        if (!vehicle.getCompanyId().equals(companyId)) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(vehicle);
    }



    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(
            @PathVariable String id,
            @RequestHeader("X-Company-Id") String companyId) {

        log.info("[Vehicle] Fetching vehicle: {} for company: {}", id, companyId);

        Vehicle vehicle = vehicleService.getVehicleById(id);

        // Security Check: Ensure the vehicle belongs to the requester's company
        if (!vehicle.getCompanyId().equals(companyId)) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(vehicle);
    }

    @PatchMapping("/{id}/location")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public ResponseEntity<Vehicle> updateLocation(
            @PathVariable String id,
            @RequestBody Map<String, Object> location,
            @RequestHeader("X-Company-Id") String companyId) {

        log.info("[Vehicle] Location update for Vehicle: {} (Company: {})", id, companyId);

        // Pass companyId to service to ensure the update only happens if owned by company
        return ResponseEntity.ok(vehicleService.updateLocation(id, location.toString(), companyId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> delete(
            @PathVariable String id,
            @RequestHeader("X-Company-Id") String companyId) {

        log.info("[Vehicle] Delete request for Vehicle: {} from Company: {}", id, companyId);

        vehicleService.delete(id, companyId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Vehicle deleted successfully");
        response.put("vehicleID", id.toString());
        return ResponseEntity.ok(response);
    }
}