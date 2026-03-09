package com.translink.RouteService.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "routes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Route {
    @Id
    private String id; // PK

    @Column(name = "vehicle_id")
    private String vehicleID; // FK link to Vehicle

    @Column(columnDefinition = "TEXT")
    private String stops; // JSON representing Lat/Lng stops

    private Float totalDistance;
    private Double totalDuration;
    private Double totalFuelExpense;

    @Column(name = "company_id", nullable = false)
    private String companyId;

    @Column(name = "created_by_id", nullable = false)
    private String createdById;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}