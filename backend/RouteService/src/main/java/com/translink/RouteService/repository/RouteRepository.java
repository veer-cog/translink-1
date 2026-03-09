package com.translink.RouteService.repository;

import com.translink.RouteService.model.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, String> {
    // Supports Query: ?vehicleID=V101
    List<Route> findByCompanyId(String companyId);

    List<Route> findByVehicleIDAndCompanyId(String vehicleID, String companyId);
}