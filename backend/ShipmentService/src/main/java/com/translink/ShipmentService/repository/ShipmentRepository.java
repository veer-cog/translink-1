package com.translink.ShipmentService.repository;

import com.translink.ShipmentService.model.Shipment;
import com.translink.ShipmentService.model.ShipmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

    // Multi-tenant filter: Only get shipments belonging to the user's company
    List<Shipment> findByCompanyId(String companyId);

    Page<Shipment> findByCompanyId(String companyId, Pageable pageable);

    List<Shipment> findAllByRouteIdAndCompanyId(String routeId, String companyId);

    // Find shipments for a specific vehicle within a company
    List<Shipment> findByVehicleIdAndCompanyId(Long vehicleId, String companyId);

    @Query("SELECT MONTH(s.dispatchedAt) as month, s.status as status, COUNT(s) as count " +
            "FROM Shipment s " +
            "WHERE s.companyId = :companyId " +
            "AND s.dispatchedAt >= :startOfYear " +
            "GROUP BY MONTH(s.dispatchedAt), s.status")
    List<Object[]> findMonthlyCountsByCompany(
            @Param("companyId") String companyId,
            @Param("startOfYear") LocalDateTime startOfYear
    );
}
