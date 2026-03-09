package com.translink.vehicle.service;

import com.translink.vehicle.model.Maintenance;
import com.translink.vehicle.repository.MaintenanceRepository;
import com.translink.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final VehicleRepository vehicleRepository;

    public List<Maintenance> getAllLogsByCompany(String companyId) {
        return maintenanceRepository.findByCompanyId(companyId);
    }

    /**
     * MODIFIED: vehicleId is now a String (e.g., "TRK-987")
     */
    public List<Maintenance> getLogsByVehicle(String vehicleId, String companyId) {
        // Uses the number plate string for the query
        return maintenanceRepository.findByVehicleNumberPlateAndCompanyId(vehicleId, companyId);
    }

    /**
     * MODIFIED: Accepts String vehicleId. 
     * Uses findByNumberPlate instead of findById.
     */
    @Transactional
    public Maintenance saveLog(Maintenance logEntity, String vehicleId) {
        // Look up vehicle by Plate String
        return vehicleRepository.findByNumberPlate(vehicleId).map(vehicle -> {

            // Multi-tenancy check
            if (!vehicle.getCompanyId().equals(logEntity.getCompanyId())) {
                throw new RuntimeException("Unauthorized: Vehicle does not belong to your company.");
            }

            logEntity.setVehicle(vehicle);
            return maintenanceRepository.save(logEntity);
        }).orElseThrow(() -> new RuntimeException("Vehicle not found with Plate: " + vehicleId));
    }

    /**
     * NOTE: 'id' here remains Long because it is the Primary Key of the LOG itself.
     */
    @Transactional
    public Maintenance updateLog(Long id, Maintenance updatedDetails, String companyId) {
        Maintenance existingLog = maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance log not found"));

        if (!existingLog.getCompanyId().equals(companyId)) {
            throw new RuntimeException("Unauthorized: Access Denied.");
        }

        existingLog.setServiceType(updatedDetails.getServiceType());
        existingLog.setCost(updatedDetails.getCost());
        existingLog.setStatus(updatedDetails.getStatus());
        existingLog.setDescription(updatedDetails.getDescription());

        return maintenanceRepository.save(existingLog);
    }

    @Transactional
    public void deleteLog(Long id, String companyId) {
        Maintenance existingLog = maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance log not found"));

        // Multi-tenancy security check
        if (!existingLog.getCompanyId().equals(companyId)) {
            throw new RuntimeException("Unauthorized: Access Denied.");
        }

        maintenanceRepository.delete(existingLog);
    }
}