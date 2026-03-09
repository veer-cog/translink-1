package com.translink.AnalyticsService.service;

import com.translink.AnalyticsService.dto.*;
import com.translink.AnalyticsService.client.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final VehicleMaintClient vehicleMaintClient; 
    private final ShipmentClient shipmentClient;

    /**
     * NEW LOGIC: Transforms shipments into the Recent Logistics Table format.
     */
    public List<RecentLogisticsDTO> getRecentLogisticsOperations() {
        return shipmentClient.getShipments().stream()
            .filter(s -> s.getDispatchedAt() != null)
            .map(s -> RecentLogisticsDTO.builder()
                .shipmentId(s.getShipmentNumber())
                // Using IDs from teammate's service
                .route(s.getOriginHubId() + " → " + s.getDestinationHubId())
                .date(s.getDispatchedAt().toLocalDate())
                // Converts status to lowercase for frontend badge styling
                .status(s.getStatus() != null ? s.getStatus().toLowerCase() : "unknown")
                // Calculate fake cost (25% of revenue)
                .cost(String.format("$%,.0f", (s.getRevenue() != null ? s.getRevenue() : 0.0) * 0.25))
                .build())
            .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
            .limit(10)
            .collect(Collectors.toList());
    }

    public DashboardSummaryDTO getSummaryByPeriod(String period) {
        LocalDateTime startThreshold = calculateStartDateTime(period);
        List<ShipmentDTO> shipments = shipmentClient.getShipments();
        List<VehicleDTO> vehicles = vehicleMaintClient.getVehicles(null);

        List<ShipmentDTO> filtered = shipments.stream()
            .filter(s -> s.getDispatchedAt() != null && !s.getDispatchedAt().isBefore(startThreshold))
            .collect(Collectors.toList());

        double revenue = filtered.stream()
            .mapToDouble(s -> s.getRevenue() != null ? s.getRevenue() : 0.0).sum();
        
        long deliveryCount = filtered.stream()
            .filter(s -> "DELIVERED".equalsIgnoreCase(s.getStatus())).count();

        return DashboardSummaryDTO.builder()
            .totalRevenue(revenue)
            .totalDeliveries(deliveryCount)
            .fleetUtilization(calculateUtilization(vehicles))
            .revenueChangeLabel("+12.5% vs last " + period)
            .deliveriesChangeLabel("+8.3% vs last " + period)
            .marginChangeLabel("+2.1% vs last " + period)      
            .utilizationChangeLabel("+5.2% vs last " + period)
            .profitMargin(75.0)
            .build();
    }

    public List<TrendDataDTO> getHistoricalTrends() {
        return shipmentClient.getShipments().stream()
            .filter(s -> s.getDispatchedAt() != null)
            .collect(Collectors.groupingBy(s -> s.getDispatchedAt().getMonth().name().substring(0, 3)))
            .entrySet().stream()
            .map(entry -> {
                double monthlyRev = entry.getValue().stream()
                    .mapToDouble(s -> s.getRevenue() != null ? s.getRevenue() : 0.0).sum();
                return TrendDataDTO.builder()
                    .month(entry.getKey())
                    .revenue(monthlyRev)
                    .cost(monthlyRev * 0.25)
                    .build();
            }).collect(Collectors.toList());
    }

    public CostBreakdownDTO getDetailedCosts() {
        List<ShipmentDTO> shipments = shipmentClient.getShipments();
        List<MaintDTO> logs = vehicleMaintClient.getLogs();

        double totalRevenue = shipments.stream()
            .mapToDouble(s -> s.getRevenue() != null ? s.getRevenue() : 0.0).sum();
        
        double fuel = totalRevenue * 0.15;
        double labor = totalRevenue * 0.10;
        double maintenance = logs.stream()
            .mapToDouble(l -> l.getCost() != null ? l.getCost() : 0.0).sum();

        return CostBreakdownDTO.builder()
            .fuel(fuel)
            .maintenance(maintenance)
            .labor(labor)
            .insurance(13200.0)
            .totalOperatingCost(fuel + labor + maintenance + 13200.0)
            .build();
    }

    private double calculateUtilization(List<VehicleDTO> vehicles) {
        if (vehicles == null || vehicles.isEmpty()) return 0.0;
        long active = vehicles.stream().filter(v -> "ACTIVE".equalsIgnoreCase(v.getStatus())).count();
        return ((double) active / vehicles.size()) * 100;
    }

    private LocalDateTime calculateStartDateTime(String period) {
        return switch (period.toLowerCase()) {
            case "week" -> LocalDateTime.now().minusWeeks(1);
            case "year" -> LocalDateTime.now().minusYears(1);
            default -> LocalDateTime.now().minusMonths(1);
        };
    }
}