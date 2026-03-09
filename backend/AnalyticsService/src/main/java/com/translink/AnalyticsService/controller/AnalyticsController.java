package com.translink.AnalyticsService.controller;

import com.translink.AnalyticsService.dto.*;
import com.translink.AnalyticsService.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor 
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public ResponseEntity<DashboardSummaryDTO> getSummary(
            @RequestParam(defaultValue = "month") String period) {
        return ResponseEntity.ok(analyticsService.getSummaryByPeriod(period));
    }

    @GetMapping("/revenue-cost-trend")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TrendDataDTO>> getTrendData() {
        return ResponseEntity.ok(analyticsService.getHistoricalTrends());
    }

    @GetMapping("/costs/breakdown")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CostBreakdownDTO> getCostAnalysis() {
        return ResponseEntity.ok(analyticsService.getDetailedCosts());
    }

    /**
     * UPDATED: Returns the list for the "Recent Logistics Operations" table.
     */
    @GetMapping("/recent-logistics-operations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RecentLogisticsDTO>> getRecentLogisticsOperations() {
        return ResponseEntity.ok(analyticsService.getRecentLogisticsOperations());
    }

}