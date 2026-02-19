package com.translink.ShipmentService.service;

import com.translink.ShipmentService.client.VehicleClient;
import com.translink.ShipmentService.model.Shipment;
import com.translink.ShipmentService.repository.ShipmentRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final VehicleClient vehicleClient;

    /**
     * Logic to generate a unique Tracking Number
     * Format: TL-YYMMDD-XXXX (e.g., TL-240520-A9B2)
     */
    private String generateTrackingNumber() {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder salt = new StringBuilder();
        Random rnd = new Random();
        while (salt.length() < 4) {
            salt.append(characters.charAt(rnd.nextInt(characters.length())));
        }
        return "TL-" + datePart + "-" + salt.toString();
    }

    @Transactional
    public Shipment createShipment(Shipment shipment, String companyId, String userId) {
        // 1. Validate vehicle exists in the Vehicle Microservice
        var vehicle = vehicleClient.getVehicleById(shipment.getVehicleId());
        if (vehicle == null) {
            throw new RuntimeException("Validation Error: Vehicle ID " + shipment.getVehicleId() + " not found.");
        }

        // 2. Set Multi-tenant and Identity fields
        // Note: Primary Key 'id' is Long Identity, not UUID
        shipment.setCompanyId(companyId);
        shipment.setCreatedBy(userId);

        // 3. Generate the business tracking number
        shipment.setShipmentNumber(generateTrackingNumber());

        return shipmentRepository.save(shipment);
    }

    /**
     * Multi-tenant Fetch: Only returns shipments for the specific company.
     */
    public List<Shipment> getMyCompanyShipments(String companyId) {
        return shipmentRepository.findByCompanyId(companyId);
    }

    public Shipment getShipmentDetails(Long id) {
        return shipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shipment not found with ID: " + id));
    }
}