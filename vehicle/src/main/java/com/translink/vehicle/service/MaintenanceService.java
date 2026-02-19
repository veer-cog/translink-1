package com.translink.vehicle.service;

import com.translink.vehicle.model.Maintenance;
import com.translink.vehicle.repository.MaintenanceRepository;
import com.translink.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final VehicleRepository vehicleRepository;

    public List<Maintenance> getAllLogs() {
        return maintenanceRepository.findAll();
    }

    public List<Maintenance> getLogsByVehicle(Long vehicleId) {
        return maintenanceRepository.findByVehicleId(vehicleId);
    }

    // In MaintenanceService.java

    @Transactional
    public Maintenance saveLog(Maintenance log, Long vehicleId) {
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        java.util.Map<String, Object> details = (java.util.Map<String, Object>) auth.getDetails();

        String companyId = (String) details.get("companyId");
        String userId = (String) details.get("userId");

        return vehicleRepository.findById(vehicleId).map(vehicle -> {
            log.setVehicle(vehicle);
            log.setCompanyId(companyId);
            log.setCreatedBy(userId);
            return maintenanceRepository.save(log);
        }).orElseThrow(() -> new RuntimeException("Vehicle not found"));
    }

    @Transactional
    public Maintenance updateLog(Long id, Maintenance updatedDetails) {
        Maintenance existingLog = maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Log not found"));
        
        existingLog.setServiceType(updatedDetails.getServiceType());
        existingLog.setCost(updatedDetails.getCost());
        existingLog.setStatus(updatedDetails.getStatus());
        existingLog.setDescription(updatedDetails.getDescription());
        
        return maintenanceRepository.save(existingLog);
    }

    public void deleteLog(Long id) {
        maintenanceRepository.deleteById(id);
    }
}