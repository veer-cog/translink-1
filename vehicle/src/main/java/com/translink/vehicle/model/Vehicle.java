package com.translink.vehicle.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "vehicles")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // [cite: 37]

    @Column(nullable = false, unique = true)
    private String numberPlate; // [cite: 40]

    private String status; // Active/In Maintenance [cite: 42, 43]

    private String type; // Truck/Trailer [cite: 45, 46]

    private String dvrName; // Driver Name [cite: 48]

    @Column(columnDefinition = "JSON")
    private String location; // Lat/Lng/Speed [cite: 50, 51]

    private LocalDateTime createdAt; // [cite: 52]

    private LocalDateTime updatedAt; // [cite: 53]

    @Column(name = "company_id")
    private String companyId;

    @Column(name = "created_by")
    private String createdBy;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL)
    private List<Maintenance> maintenanceLogs; // [cite: 36, 57]
    
 // Add this field inside your existing Vehicle class
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hub_id") // This creates the Foreign Key column in the vehicles table
    private Hub hub;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}