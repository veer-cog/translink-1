package com.translink.vehicle.service;

import com.translink.vehicle.model.Vehicle;
import com.translink.vehicle.model.Hub;
import com.translink.vehicle.repository.VehicleRepository;
import com.translink.vehicle.repository.HubRepository; // Added
import com.translink.vehicle.client.ComplianceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository repository;
    private final HubRepository hubRepository; // Added
    private final ComplianceClient complianceClient;

    // In VehicleService.java

    @Transactional
    public Vehicle save(Vehicle vehicle) {
        // 1. Extract security details from the context
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        java.util.Map<String, Object> details = (java.util.Map<String, Object>) auth.getDetails();

        String companyId = (String) details.get("companyId");
        String userId = (String) details.get("userId");

        // 2. Set the audit and tenancy fields
        vehicle.setCompanyId(companyId);
        vehicle.setCreatedBy(userId);

        // 3. Link Hub if provided
        if (vehicle.getHub() != null && vehicle.getHub().getId() != null) {
            Hub hub = hubRepository.findById(vehicle.getHub().getId())
                    .orElseThrow(() -> new RuntimeException("Hub not found"));
            vehicle.setHub(hub);
        }

        return repository.saveAndFlush(vehicle);
    }
    public Vehicle getVehicleById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
    }
    // Add this to ensure users only see their own company's vehicles
    public List<Vehicle> findAllFiltered(String status) {
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        java.util.Map<String, Object> details = (java.util.Map<String, Object>) auth.getDetails();
        String companyId = (String) details.get("companyId");

        if (status != null && !status.isEmpty()) {
            return repository.findByStatusAndCompanyId(status, companyId);
        }
        return repository.findByCompanyId(companyId);
    }


    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Transactional
    public Vehicle updateLocation(Long id, String location) {
        Vehicle vehicle = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        vehicle.setLocation(location);
        return repository.save(vehicle);
    }
}