package com.translink.ShipmentService.repository;

import com.translink.ShipmentService.model.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

    // Multi-tenant filter: Only get shipments belonging to the user's company
    List<Shipment> findByCompanyId(String companyId);

    // Find by the human-readable shipment number
    Optional<Shipment> findByShipmentNumber(String shipmentNumber);

    // Find shipments for a specific vehicle within a company
    List<Shipment> findByVehicleIdAndCompanyId(Long vehicleId, String companyId);
}