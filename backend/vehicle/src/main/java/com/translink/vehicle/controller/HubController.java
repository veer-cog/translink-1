package com.translink.vehicle.controller;

import com.translink.vehicle.model.Hub;
import com.translink.vehicle.repository.HubRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/hubs")
@RequiredArgsConstructor
public class HubController {

    private final HubRepository hubRepository;

    /**
     * Fetch all hubs for the current company.
     * Filtered by companyId to ensure data isolation.
     */
    @GetMapping
    public List<Hub> getAllHubs(@RequestHeader("X-Company-Id") String companyId) {
        log.info("[Hub] Fetching all hubs for company: {}", companyId);
        // Assuming your repository has a findByCompanyId method
        return hubRepository.findByCompanyId(companyId);
    }

    /**
     * Create a hub using identity headers from the Gateway.
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createHub(
            @RequestBody Hub hub,
            @RequestHeader("X-Company-Id") String companyId,
            @RequestHeader("X-User-Id") String userId) {

        log.info("[Hub] Creating hub: {} for company: {}", hub.getHubName(), companyId);

        // Directly set the IDs from the headers
        hub.setCompanyId(companyId);
        hub.setCreatedBy(userId);

        Hub savedHub = hubRepository.save(hub);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hub created successfully");
        response.put("data", savedHub);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete hub with a check to ensure it belongs to the company.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteHub(
            @PathVariable Long id,
            @RequestHeader("X-Company-Id") String companyId) {

        // Best practice: Find by ID and CompanyId before deleting
        Hub existingHub = hubRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hub not found"));

        if (!existingHub.getCompanyId().equals(companyId)) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        hubRepository.deleteById(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Hub deleted successfully for ID: " + id);
        response.put("status", "Deleted");
        return ResponseEntity.ok(response);
    }
}