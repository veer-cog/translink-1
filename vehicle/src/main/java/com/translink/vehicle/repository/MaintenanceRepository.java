package com.translink.vehicle.repository;

import com.translink.vehicle.model.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    // Supports GET /maintenance?vehicleID=...
    List<Maintenance> findByVehicleId(Long vehicleId); //[cite: 287]
}