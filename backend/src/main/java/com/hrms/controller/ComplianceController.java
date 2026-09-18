package com.hrms.controller;

import com.hrms.dto.Form12BBRequest;
import com.hrms.service.ComplianceService;
import com.hrms.service.EmployeeService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/compliance")
public class ComplianceController {

    private final ComplianceService complianceService;
    private final EmployeeService employeeService;

    public ComplianceController(ComplianceService complianceService, EmployeeService employeeService) {
        this.complianceService = complianceService;
        this.employeeService = employeeService;
    }

    @GetMapping("/pf-ecr/{month}")
    public ResponseEntity<byte[]> getPfEcrFile(@PathVariable String month) {
        String ecrContent = complianceService.generatePfEcrFile(month);
        byte[] bytes = ecrContent.getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"PF_ECR_" + month + ".txt\"")
                .contentType(MediaType.TEXT_PLAIN)
                .body(bytes);
    }

    @GetMapping("/esi-challan/{month}")
    public ResponseEntity<byte[]> getEsiChallan(@PathVariable String month) {
        String challan = complianceService.generateEsiChallan(month);
        byte[] bytes = challan.getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"ESIC_Challan_" + month + ".csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }

    @GetMapping("/form16/{year}")
    public ResponseEntity<Map<String, Object>> getForm16(
            @PathVariable String year,
            @RequestParam UUID employeeId) {
        return ResponseEntity.ok(complianceService.generateForm16(employeeId, year));
    }

    @GetMapping("/form24q")
    public ResponseEntity<byte[]> getForm24Q(
            @RequestParam(defaultValue = "Q4") String quarter,
            @RequestParam(defaultValue = "2025-2026") String year) {
        String data = complianceService.generateForm24Q(quarter, year);
        byte[] bytes = data.getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Form24Q_" + quarter + "_" + year + ".txt\"")
                .contentType(MediaType.TEXT_PLAIN)
                .body(bytes);
    }

    @PostMapping("/form12bb")
    public ResponseEntity<?> submitForm12BB(
            @RequestParam UUID employeeId,
            @RequestBody Form12BBRequest request) {
        if (request.getTaxRegime() != null) {
            employeeService.updateTaxRegime(employeeId, request.getTaxRegime());
        }
        return ResponseEntity.ok(Map.of(
                "status", "SUBMITTED",
                "message", "Form 12BB tax declaration submitted successfully. Regime: " + request.getTaxRegime(),
                "declaration", request
        ));
    }
}
