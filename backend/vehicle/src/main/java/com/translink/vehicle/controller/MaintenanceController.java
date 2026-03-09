package com.translink.vehicle.controller;

import com.translink.vehicle.model.Maintenance;
import com.translink.vehicle.service.MaintenanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @GetMapping
    public List<Maintenance> getLogs(
            @RequestParam(required = false) String vehicleID, 
            @RequestHeader("X-Company-Id") String companyId) {

        log.info("[Maintenance] Fetching logs for company: {} (Vehicle Filter: {})", companyId, vehicleID);

        
        if (vehicleID != null && !vehicleID.isEmpty()) {
            return maintenanceService.getLogsByVehicle(vehicleID, companyId);
        }
        return maintenanceService.getAllLogsByCompany(companyId);
    }

    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createLog(
            @RequestBody Maintenance maintenanceLog,
            @RequestParam String vehicleID, // CHANGED from Long to String
            @RequestHeader("X-Company-Id") String companyId,
            @RequestHeader("X-User-Id") String userId) {

        log.info("[Maintenance] Creating log for vehicle: {} by user: {}", vehicleID, userId);

        
        maintenanceLog.setCompanyId(companyId);
        maintenanceLog.setCreatedBy(userId);

        
        Maintenance savedLog = maintenanceService.saveLog(maintenanceLog, vehicleID);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Maintenance log created successfully");
        response.put("data", savedLog);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateLog(
            @PathVariable Long id, 
            @RequestBody Maintenance logDetails,
            @RequestHeader("X-Company-Id") String companyId) {
     
        return ResponseEntity.ok(Map.of("data", maintenanceService.updateLog(id, logDetails, companyId)));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLog(
            @PathVariable Long id,
            @RequestHeader("X-Company-Id") String companyId) {
        
        log.info("[Maintenance] Deleting log ID: {} for company: {}", id, companyId);
        maintenanceService.deleteLog(id, companyId);
        return ResponseEntity.noContent().build();
    }
}