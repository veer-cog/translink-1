package com.translink.vehicle.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "hubs")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Hub {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String hubName; // e.g., "Main Depot"

    private String location; // City or Address

    @Column(name = "company_id")
    private String companyId;

    @Column(name = "created_by")
    private String createdBy;

    @OneToMany(mappedBy = "hub")
    @JsonIgnore // Prevents infinite loops when fetching hub details
    private List<Vehicle> vehicles;
}