package com.translink.vehicle.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_logs")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Maintenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //

 // Inside Maintenance.java
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore // ADD THIS TO STOP THE LOOP
    private Vehicle vehicle;

    private String serviceType; // Oil, Tires, Engine [cite: 84, 85]

    private String status; // Pending, In Progress, Done 

    private String mechanicName; // [cite: 95]

    private Double cost; // [cite: 127]

    @Column(columnDefinition = "TEXT")
    private String description; // [cite: 120]

    private LocalDateTime timestamp; // [cite: 131]

    private LocalDateTime updatedAt; // [cite: 132]


    @Column(name = "company_id")
    private String companyId;

    @Column(name = "created_by")
    private String createdBy;


    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}