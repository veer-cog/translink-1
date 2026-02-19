package com.translink.ShipmentService.controller;

import com.translink.ShipmentService.model.Shipment;
import com.translink.ShipmentService.service.ShipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/shipments")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createShipment(@RequestBody Shipment shipment) {
        // 1. Get Authentication Details from the Filter
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> details = (Map<String, Object>) auth.getDetails();

        String companyId = (String) details.get("companyId");
        String userId = (String) details.get("userId");

        // 2. Call Service to save with generated tracking number
        Shipment savedShipment = shipmentService.createShipment(shipment, companyId, userId);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Shipment created successfully");
        response.put("trackingNumber", savedShipment.getShipmentNumber());
        response.put("data", savedShipment);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<Shipment>> getAllMyShipments() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> details = (Map<String, Object>) auth.getDetails();
        String companyId = (String) details.get("companyId");

        return ResponseEntity.ok(shipmentService.getMyCompanyShipments(companyId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shipment> getShipment(@PathVariable Long id) {
        return ResponseEntity.ok(shipmentService.getShipmentDetails(id));
    }
}