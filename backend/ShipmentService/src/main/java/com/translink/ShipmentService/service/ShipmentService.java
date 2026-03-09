package com.translink.ShipmentService.service;

import com.translink.ShipmentService.client.RouteClient;
import com.translink.ShipmentService.client.VehicleClient;
import com.translink.ShipmentService.model.Shipment;
import com.translink.ShipmentService.model.ShipmentStatus;
import com.translink.ShipmentService.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final VehicleClient vehicleClient;
    private final RouteClient routeClient;

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
        log.info("Creating shipment for Company: {} by User: {}", companyId, userId);

        var vehicle = vehicleClient.getVehicleById(shipment.getVehicleId());
        if (vehicle == null) {
            log.error("Creation failed: Vehicle {} not found", shipment.getVehicleId());
            throw new RuntimeException("Vehicle ID " + shipment.getVehicleId() + " not found.");
        }

        if (shipment.getRouteId() != null) {
            var route = routeClient.getRouteById(shipment.getRouteId());
            if (route == null || !route.getVehicleID().equals(shipment.getVehicleId().toString())) {
                log.warn("Invalid Route ID {} for Vehicle {}", shipment.getRouteId(), shipment.getVehicleId());
                throw new RuntimeException("Selected route does not match the assigned vehicle.");
            }
        }

        shipment.setCompanyId(companyId);
        shipment.setCreatedBy(userId);
        shipment.setShipmentNumber(generateTrackingNumber());

        Shipment saved = shipmentRepository.save(shipment);
        log.info("Shipment created successfully: {}", saved.getShipmentNumber());
        return saved;
    }

    @Transactional
    public Shipment updateShipmentStatus(Long id, String newStatus, String companyId) {
        log.info("Updating Shipment {} status to {} for Company {}", id, newStatus, companyId);

        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shipment not found with ID: " + id));

        if (!shipment.getCompanyId().equals(companyId)) {
            log.error("Unauthorized status update attempt on Shipment {} by Company {}", id, companyId);
            throw new RuntimeException("Unauthorized access to this shipment.");
        }

        try {
            shipment.setStatus(ShipmentStatus.valueOf(newStatus.toUpperCase()));
            return shipmentRepository.save(shipment);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + newStatus);
        }
    }

    public List<Shipment> getMyCompanyShipments(String companyId) {
        log.debug("Fetching all shipments for Company: {}", companyId);
        return shipmentRepository.findByCompanyId(companyId);
    }

    public List<Shipment> getShipmentsByVehicle(Long vehicleId, String companyId) {
        log.info("Fetching shipments for Vehicle: {} (Company: {})", vehicleId, companyId);
        return shipmentRepository.findByVehicleIdAndCompanyId(vehicleId, companyId);
    }

    public List<Shipment> getShipmentsByRoute(String routeId, String companyId) {
        log.info("Fetching shipments for Route: {} (Company: {})", routeId, companyId);
        return shipmentRepository.findAllByRouteIdAndCompanyId(routeId, companyId);
    }

    public Page<Shipment> getPaginatedShipments(String companyId, int page) {
        log.info("Fetching page {} of shipments for Company: {}", page, companyId);
        // PageRequest is 0-indexed; size is set to 5 as requested
        Pageable pageable = PageRequest.of(page, 5);
        return shipmentRepository.findByCompanyId(companyId, pageable);
    }

    public Shipment getShipmentDetails(Long id) {
        return shipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shipment not found with ID: " + id));
    }

    public Map<String, Object> getRawChartData(String companyId) {
        int currentMonth = LocalDateTime.now().getMonthValue();
        LocalDateTime startOfYear = LocalDateTime.now().withDayOfYear(1).withHour(0).withMinute(0).withSecond(0).withNano(0);

        // 1. Fetch all data for the year in ONE database call
        List<Object[]> results = shipmentRepository.findMonthlyCountsByCompany(companyId, startOfYear);

        // 2. Prepare empty lists for all months (Jan to Current)
        List<String> labels = new ArrayList<>();
        List<Long> createdData = new ArrayList<>(Collections.nCopies(currentMonth, 0L));
        List<Long> inTransitData = new ArrayList<>(Collections.nCopies(currentMonth, 0L));
        List<Long> deliveredData = new ArrayList<>(Collections.nCopies(currentMonth, 0L));
        List<Long> cancelledData = new ArrayList<>(Collections.nCopies(currentMonth, 0L));

        // 3. Fill labels
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM");
        for (int i = 1; i <= currentMonth; i++) {
            labels.add(startOfYear.withMonth(i).format(formatter));
        }

        // 4. Map the DB results into the correct list positions
        for (Object[] row : results) {
            int monthIndex = (int) row[0] - 1; // Month 1 (Jan) becomes index 0
            ShipmentStatus status = (ShipmentStatus) row[1];
            Long count = (Long) row[2];

            if (monthIndex < currentMonth) {
                switch (status) {
                    case CREATED -> createdData.set(monthIndex, count);
                    case IN_TRANSIT -> inTransitData.set(monthIndex, count);
                    case DELIVERED -> deliveredData.set(monthIndex, count);
                    case CANCELLED -> cancelledData.set(monthIndex, count);
                }
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("labels", labels);
        response.put("created", createdData);
        response.put("in_transit", inTransitData);
        response.put("delivered", deliveredData);
        response.put("cancelled", cancelledData);

        return response;
    }
}