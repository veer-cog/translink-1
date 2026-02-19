package com.translink.vehicle.controller;

import com.translink.vehicle.model.Hub;
import com.translink.vehicle.repository.HubRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/hubs")
@RequiredArgsConstructor
public class HubController {

    private final HubRepository hubRepository;

    @GetMapping
    public List<Hub> getAllHubs() {
        return hubRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createHub(@RequestBody Hub hub) {
        // 1. Get Authentication from SecurityContext
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.getDetails() instanceof java.util.Map) {
            // 2. Extract the Map we created in JwtAuthenticationFilter
            java.util.Map<String, Object> details = (java.util.Map<String, Object>) auth.getDetails();

            // 3. Set the IDs (Casting to String for your UUIDs)
            hub.setCompanyId((String) details.get("companyId"));
            hub.setCreatedBy((String) details.get("userId"));
        }

        Hub savedHub = hubRepository.save(hub);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hub created successfully");
        response.put("data", savedHub);
        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteHub(@PathVariable Long id) {
        hubRepository.deleteById(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hub deleted successfully for ID: " + id);
        response.put("status", "Deleted");
        return ResponseEntity.ok(response);
    }
}