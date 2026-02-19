package com.translink.vehicle.controller;

import com.translink.vehicle.model.Maintenance;
import com.translink.vehicle.service.MaintenanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @GetMapping
    public List<Maintenance> getLogs(@RequestParam(required = false) Long vehicleID) {
        if (vehicleID != null) {
            return maintenanceService.getLogsByVehicle(vehicleID);
        }
        return maintenanceService.getAllLogs();
    }

    // POST: Returns "Maintenance log created successfully"
    @PostMapping
    public ResponseEntity<Map<String, Object>> createLog(@RequestBody Maintenance log, @RequestParam Long vehicleID) {
        Maintenance savedLog = maintenanceService.saveLog(log, vehicleID);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Maintenance log created successfully");
        response.put("data", savedLog);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // PUT: Returns "Maintenance log updated successfully"
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateLog(@PathVariable Long id, @RequestBody Maintenance log) {
        Maintenance updatedLog = maintenanceService.updateLog(id, log);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Maintenance log updated successfully");
        response.put("data", updatedLog);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteLog(@PathVariable Long id) {
        maintenanceService.deleteLog(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Maintenance log deleted successfully");
        response.put("logID", id.toString());
        return ResponseEntity.ok(response);
    }
}