package com.translink.vehicle.repository;

import com.translink.vehicle.model.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    
    // Find logs by the number plate string inside the associated Vehicle object
    // Query: SELECT m FROM Maintenance m JOIN m.vehicle v WHERE v.numberPlate = ?1 AND m.companyId = ?2
    List<Maintenance> findByVehicleNumberPlateAndCompanyId(String numberPlate, String companyId);

    List<Maintenance> findByCompanyId(String companyId);
    
    // Keep this only if you still need to find by DB Primary Key occasionally
    List<Maintenance> findByVehicleIdAndCompanyId(Long vehicleId, String companyId);
}