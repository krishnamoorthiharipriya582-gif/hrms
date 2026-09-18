package com.hrms.controller;

import com.hrms.dto.AppraisalRatingRequest;
import com.hrms.entity.Appraisal;
import com.hrms.service.PerformanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/performance")
public class PerformanceController {

    private final PerformanceService performanceService;

    public PerformanceController(PerformanceService performanceService) {
        this.performanceService = performanceService;
    }

    @GetMapping("/appraisals")
    public ResponseEntity<List<Appraisal>> getAllAppraisals(@RequestParam(required = false) String year) {
        return ResponseEntity.ok(performanceService.getAllAppraisals(year));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<Appraisal> getEmployeeAppraisal(
            @PathVariable UUID employeeId,
            @RequestParam(required = false) String year) {
        return ResponseEntity.ok(performanceService.getOrCreateAppraisal(employeeId, year));
    }

    @PostMapping("/{id}/goals")
    public ResponseEntity<Appraisal> setGoals(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(performanceService.setGoals(id, body.get("goalsJson")));
    }

    @PostMapping("/{id}/self-review")
    public ResponseEntity<Appraisal> submitSelfReview(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> body) {
        BigDecimal rating = new BigDecimal(body.get("rating").toString());
        String comments = body.getOrDefault("comments", "").toString();
        return ResponseEntity.ok(performanceService.submitSelfAssessment(id, rating, comments));
    }

    @PostMapping("/{id}/manager-review")
    public ResponseEntity<Appraisal> submitManagerReview(
            @PathVariable UUID id,
            @RequestBody AppraisalRatingRequest req,
            Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "manager";
        return ResponseEntity.ok(performanceService.submitManagerReview(id, req, actor));
    }

    @PostMapping("/{id}/finalize")
    public ResponseEntity<Appraisal> finalizeAppraisal(
            @PathVariable UUID id,
            @RequestParam BigDecimal finalRating,
            @RequestParam BigDecimal incrementPct,
            Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "hr";
        return ResponseEntity.ok(performanceService.finalizeAppraisal(id, finalRating, incrementPct, actor));
    }

    @GetMapping("/bell-curve")
    public ResponseEntity<Map<String, Object>> getBellCurve(@RequestParam(required = false) String year) {
        return ResponseEntity.ok(performanceService.getBellCurveStats(year));
    }
}
