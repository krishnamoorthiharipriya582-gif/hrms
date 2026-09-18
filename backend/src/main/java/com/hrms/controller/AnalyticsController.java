package com.hrms.controller;

import com.hrms.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/headcount")
    public ResponseEntity<Map<String, Object>> getHeadcount() {
        return ResponseEntity.ok(analyticsService.getHeadcountAnalytics());
    }

    @GetMapping("/payroll-cost")
    public ResponseEntity<Map<String, Object>> getPayrollCost() {
        return ResponseEntity.ok(analyticsService.getPayrollCostAnalytics());
    }

    @GetMapping("/compliance-calendar")
    public ResponseEntity<List<Map<String, Object>>> getComplianceCalendar() {
        return ResponseEntity.ok(analyticsService.getComplianceCalendar());
    }
}
