package com.translink.ShipmentService.controller;

import com.translink.ShipmentService.model.Shipment;
import com.translink.ShipmentService.service.ShipmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/shipments")
@RequiredArgsConstructor
@Slf4j
public class ShipmentController {

    private final ShipmentService shipmentService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createShipment(
            @RequestBody Shipment shipment,
            @RequestHeader("X-Company-Id") String companyId,
            @RequestHeader("X-User-Id") String userId) {

        log.info("REST: Create Shipment for Company {}", companyId);
        Shipment savedShipment = shipmentService.createShipment(shipment, companyId, userId);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Shipment created successfully");
        response.put("trackingNumber", savedShipment.getShipmentNumber());
        response.put("data", savedShipment);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<Shipment>> getAllMyShipments(@RequestHeader("X-Company-Id") String companyId) {
        log.info("REST: Get all shipments for Company {}", companyId);
        return ResponseEntity.ok(shipmentService.getMyCompanyShipments(companyId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shipment> getShipment(@PathVariable Long id) {
        log.info("REST: Get details for Shipment {}", id);
        return ResponseEntity.ok(shipmentService.getShipmentDetails(id));
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<Shipment>> getShipmentsByVehicle(
            @PathVariable Long vehicleId,
            @RequestHeader("X-Company-Id") String companyId) {

        log.info("REST: Get shipments for Vehicle {} (Company: {})", vehicleId, companyId);
        return ResponseEntity.ok(shipmentService.getShipmentsByVehicle(vehicleId, companyId));
    }

    @GetMapping("/route/{routeId}")
    public ResponseEntity<List<Shipment>> getShipmentsByRoute(
            @PathVariable String routeId,
            @RequestHeader("X-Company-Id") String companyId) {

        log.info("REST: Get shipments for Route {} (Company: {})", routeId, companyId);
        List<Shipment> shipments = shipmentService.getShipmentsByRoute(routeId, companyId);

        return ResponseEntity.ok(shipments);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate,
            @RequestHeader("X-Company-Id") String companyId) {

        String newStatus = statusUpdate.get("status");
        log.info("REST: Update Status for Shipment {} to {}", id, newStatus);

        Shipment updated = shipmentService.updateShipmentStatus(id, newStatus, companyId);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Status updated successfully");
        response.put("newStatus", updated.getStatus());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Page<Shipment>> getPagedShipments(
            @RequestHeader("X-Company-Id") String companyId,
            @RequestParam(defaultValue = "0") int page) {

        log.info("REST: Get paged shipments (Page {}) for Company {}", page, companyId);
        Page<Shipment> shipments = shipmentService.getPaginatedShipments(companyId, page);

        return ResponseEntity.ok(shipments);
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getRawStats(@RequestHeader("X-Company-Id") String companyId) {
        log.info("REST: Fetching raw shipment stats for Company {}", companyId);
        return ResponseEntity.ok(shipmentService.getRawChartData(companyId));
    }
}