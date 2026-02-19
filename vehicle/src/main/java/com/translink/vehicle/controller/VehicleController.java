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
    @PreAuthorize("hasRole('ADMIN')") // Admin Only
    public ResponseEntity<Vehicle> create(@RequestBody Vehicle vehicle) {
        log.info("[Backend] Admin POST: Creating vehicle {}", vehicle.getNumberPlate());
        return ResponseEntity.ok(vehicleService.save(vehicle));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')") // Both can view
    public List<Vehicle> list(@RequestParam(required = false) String status) {
        log.info("[Backend] Request: Listing vehicles with status: {}", status);
        return vehicleService.findAllFiltered(status);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.getVehicleById(id));
    }
    @PatchMapping("/{id}/location")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')") // Both can update telemetry
    public ResponseEntity<Vehicle> updateLocation(@PathVariable Long id, @RequestBody Map<String, Object> location) {
        log.info("[Backend] Telemetry Update: Vehicle ID {}", id);
        return ResponseEntity.ok(vehicleService.updateLocation(id, location.toString()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        vehicleService.delete(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Vehicle deleted successfully");
        response.put("vehicleID", id.toString());
        return ResponseEntity.ok(response);
    }
}