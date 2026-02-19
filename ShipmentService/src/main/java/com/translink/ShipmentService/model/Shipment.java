package com.translink.ShipmentService.model;

import com.translink.ShipmentService.model.ShipmentStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipments")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String shipmentNumber; // e.g., TXL-2026-0001

    // --- Client Information ---
    @Column(nullable = false)
    private String clientName;

    @Column(nullable = false)
    private String clientNumber; // Phone or Account Number

    private double revenue;
    // --- Multi-tenancy & Audit ---
    private String companyId; // UUID from JWT
    private String createdBy; // User UUID from JWT

    // --- Logistics Connections ---
    private String originHubId;
    private String destinationHubId;
    private Long vehicleId;

    @Enumerated(EnumType.STRING)
    private ShipmentStatus status;

    private Double totalWeight;
    private String description;

    private LocalDateTime dispatchedAt;
    private LocalDateTime estimatedArrival;
    private LocalDateTime actualArrival;

    @PrePersist
    protected void onCreate() {
        if (this.status == null) {
            this.status = ShipmentStatus.CREATED;
        }
        this.dispatchedAt = LocalDateTime.now();
    }
}