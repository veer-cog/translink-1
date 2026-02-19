package com.translink.vehicle.repository;

import com.translink.vehicle.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    // Spring generates save, findAll, findById, and deleteById automatically
    List<Vehicle> findByStatus(String status);
    List<Vehicle> findByCompanyId(String companyId);
    List<Vehicle> findByStatusAndCompanyId(String status, String companyId);
}