package com.hrms.controller;

import com.hrms.dto.CandidateOnboardingRequest;
import com.hrms.entity.CandidateOnboarding;
import com.hrms.entity.Employee;
import com.hrms.service.OnboardingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/onboarding")
public class OnboardingController {

    private final OnboardingService onboardingService;

    public OnboardingController(OnboardingService onboardingService) {
        this.onboardingService = onboardingService;
    }

    @GetMapping("/candidates")
    public ResponseEntity<List<CandidateOnboarding>> getCandidates() {
        return ResponseEntity.ok(onboardingService.getAllCandidates());
    }

    @GetMapping("/candidates/{id}")
    public ResponseEntity<CandidateOnboarding> getCandidateById(@PathVariable UUID id) {
        return ResponseEntity.ok(onboardingService.getCandidateById(id));
    }

    @PostMapping("/candidates")
    public ResponseEntity<CandidateOnboarding> createCandidate(
            @RequestBody CandidateOnboardingRequest request,
            Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "hr";
        return ResponseEntity.ok(onboardingService.createCandidate(request, actor));
    }

    @PostMapping("/candidates/{id}/esign")
    public ResponseEntity<CandidateOnboarding> simulateESign(@PathVariable UUID id) {
        return ResponseEntity.ok(onboardingService.simulateESign(id));
    }

    @PostMapping("/candidates/{id}/verify-doc")
    public ResponseEntity<CandidateOnboarding> verifyDoc(
            @PathVariable UUID id,
            @RequestParam String docType,
            @RequestParam boolean verified) {
        return ResponseEntity.ok(onboardingService.verifyDocument(id, docType, verified));
    }

    @PostMapping("/candidates/{id}/bgv")
    public ResponseEntity<CandidateOnboarding> updateBgv(
            @PathVariable UUID id,
            @RequestParam String status) {
        return ResponseEntity.ok(onboardingService.updateBgv(id, status));
    }

    @PostMapping("/candidates/{id}/assets")
    public ResponseEntity<CandidateOnboarding> updateAssets(
            @PathVariable UUID id,
            @RequestParam boolean laptop,
            @RequestParam boolean accessCard,
            @RequestParam boolean email) {
        return ResponseEntity.ok(onboardingService.updateAssets(id, laptop, accessCard, email));
    }

    @PostMapping("/candidates/{id}/convert")
    public ResponseEntity<Employee> convertToEmployee(
            @PathVariable UUID id,
            Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "hr";
        return ResponseEntity.ok(onboardingService.convertToEmployee(id, actor));
    }
}
