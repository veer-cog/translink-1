package com.translink.vehicle.repository;

import com.translink.vehicle.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    // Add this to support string-based lookup from your Angular Route
    Optional<Vehicle> findByNumberPlate(String numberPlate);

    List<Vehicle> findByStatus(String status);
    List<Vehicle> findByCompanyId(String companyId);
    List<Vehicle> findByStatusAndCompanyId(String status, String companyId);
}