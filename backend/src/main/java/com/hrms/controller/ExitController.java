package com.hrms.controller;

import com.hrms.dto.ClearanceRequest;
import com.hrms.dto.FnFComputeRequest;
import com.hrms.dto.ResignationRequest;
import com.hrms.entity.ExitRecord;
import com.hrms.service.ExitService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/exit")
public class ExitController {

    private final ExitService exitService;

    public ExitController(ExitService exitService) {
        this.exitService = exitService;
    }

    @GetMapping("/records")
    public ResponseEntity<List<ExitRecord>> getAllExits() {
        return ResponseEntity.ok(exitService.getAllExits());
    }

    @GetMapping("/by-employee/{employeeId}")
    public ResponseEntity<ExitRecord> getExitByEmployee(@PathVariable UUID employeeId) {
        return exitService.getExitByEmployee(employeeId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PostMapping("/resign")
    public ResponseEntity<ExitRecord> submitResignation(
            @RequestParam UUID employeeId,
            @RequestBody ResignationRequest request) {
        return ResponseEntity.ok(exitService.submitResignation(employeeId, request));
    }

    @PutMapping("/{id}/clearance")
    public ResponseEntity<ExitRecord> updateClearance(
            @PathVariable UUID id,
            @RequestBody ClearanceRequest request,
            Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "dept_head";
        return ResponseEntity.ok(exitService.updateClearance(id, request, actor));
    }

    @PostMapping("/{id}/compute-fnf")
    public ResponseEntity<ExitRecord> computeFnF(
            @PathVariable UUID id,
            @RequestBody FnFComputeRequest request,
            Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "hr_manager";
        return ResponseEntity.ok(exitService.computeFnF(id, request, actor));
    }

    @PostMapping("/{id}/disburse-fnf")
    public ResponseEntity<ExitRecord> disburseFnF(
            @PathVariable UUID id,
            Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "cfo_admin";
        return ResponseEntity.ok(exitService.disburseFnF(id, actor));
    }
}
