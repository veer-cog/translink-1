package com.translink.vehicle.service;

import com.translink.vehicle.model.Vehicle;
import com.translink.vehicle.model.Hub;
import com.translink.vehicle.repository.VehicleRepository;
import com.translink.vehicle.repository.HubRepository;
import com.translink.vehicle.client.ComplianceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class VehicleService {

    private final VehicleRepository repository;
    private final HubRepository hubRepository;
    private final ComplianceClient complianceClient;

    /**
     * Saves a vehicle using company and user context passed from the controller.
     */
    @Transactional
    public Vehicle save(Vehicle vehicle) {
        // Note: companyId and userId are already set on the 'vehicle' object by the Controller

        // Link Hub if provided, ensuring the Hub exists
        if (vehicle.getHub() != null && vehicle.getHub().getId() != null) {
            Hub hub = hubRepository.findById(vehicle.getHub().getId())
                    .orElseThrow(() -> new RuntimeException("Hub not found with ID: " + vehicle.getHub().getId()));

            // Security Check: Ensure the Hub also belongs to the same company
            if (!hub.getCompanyId().equals(vehicle.getCompanyId())) {
                throw new RuntimeException("Unauthorized: Cannot link a vehicle to a hub belonging to another company.");
            }
            vehicle.setHub(hub);
        }

        return repository.saveAndFlush(vehicle);
    }

    /**
     * Fetch a vehicle by ID (Used by internal Feign clients like RouteService).
     */
    public Vehicle getVehicleById(String id) {
        return repository.findByNumberPlate(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with number plate: " + id));
    }


    public Vehicle getVehicleByIdforFeign(long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
    }


    /**
     * List vehicles belonging to a specific company with optional status filtering.
     */
    public List<Vehicle> findAllByCompanyFiltered(String companyId, String status) {
        if (status != null && !status.isEmpty()) {
            return repository.findByStatusAndCompanyId(status, companyId);
        }
        return repository.findByCompanyId(companyId);
    }

    /**
     * Delete a vehicle only if it belongs to the requesting company.
     */
    @Transactional
    public void delete(String id, String companyId) {
        Vehicle vehicle = getVehicleById(id);

        if (!vehicle.getCompanyId().equals(companyId)) {
            throw new RuntimeException("Unauthorized: You do not have permission to delete this vehicle.");
        }

        repository.delete(vehicle);
    }

    /**
     * Update telemetry/location data with ownership verification.
     */
    @Transactional
    public Vehicle updateLocation(String id, String location, String companyId) {
        Vehicle vehicle = getVehicleById(id);

        if (!vehicle.getCompanyId().equals(companyId)) {
            throw new RuntimeException("Unauthorized: Cannot update location for a vehicle belonging to another company.");
        }

        vehicle.setLocation(location);
        return repository.save(vehicle);
    }
}