package com.hrms.controller;

import com.hrms.entity.Department;
import com.hrms.entity.HrAuditLog;
import com.hrms.entity.SalaryStructure;
import com.hrms.entity.StatutoryConfig;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.DepartmentRepository;
import com.hrms.repository.SalaryStructureRepository;
import com.hrms.repository.StatutoryConfigRepository;
import com.hrms.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AuditService auditService;
    private final DepartmentRepository departmentRepository;
    private final SalaryStructureRepository salaryStructureRepository;
    private final StatutoryConfigRepository statutoryConfigRepository;

    public AdminController(AuditService auditService,
                           DepartmentRepository departmentRepository,
                           SalaryStructureRepository salaryStructureRepository,
                           StatutoryConfigRepository statutoryConfigRepository) {
        this.auditService = auditService;
        this.departmentRepository = departmentRepository;
        this.salaryStructureRepository = salaryStructureRepository;
        this.statutoryConfigRepository = statutoryConfigRepository;
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<HrAuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditService.getAllLogs());
    }

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getDepartments() {
        return ResponseEntity.ok(departmentRepository.findAll());
    }

    @PostMapping("/departments")
    public ResponseEntity<Department> createDepartment(@RequestBody Department department) {
        return ResponseEntity.ok(departmentRepository.save(department));
    }

    @GetMapping("/salary-structures")
    public ResponseEntity<List<SalaryStructure>> getSalaryStructures() {
        return ResponseEntity.ok(salaryStructureRepository.findAll());
    }

    @GetMapping("/statutory-config")
    public ResponseEntity<List<StatutoryConfig>> getStatutoryConfigs() {
        return ResponseEntity.ok(statutoryConfigRepository.findAll());
    }

    @PutMapping("/statutory-config/{id}")
    public ResponseEntity<StatutoryConfig> updateStatutoryConfig(@PathVariable UUID id, @RequestBody Map<String, String> payload) {
        StatutoryConfig cfg = statutoryConfigRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Statutory config not found: " + id));
        if (payload.containsKey("configValue")) {
            cfg.setConfigValue(payload.get("configValue"));
        }
        if (payload.containsKey("description")) {
            cfg.setDescription(payload.get("description"));
        }
        return ResponseEntity.ok(statutoryConfigRepository.save(cfg));
    }

    @PostMapping("/statutory-config")
    public ResponseEntity<StatutoryConfig> createStatutoryConfig(@RequestBody StatutoryConfig config) {
        return ResponseEntity.ok(statutoryConfigRepository.save(config));
    }

    @GetMapping("/company-config")
    public ResponseEntity<Map<String, Object>> getCompanyConfig() {
        return ResponseEntity.ok(Map.of(
                "companyName", "ACME Global HR & Technologies Ltd",
                "registeredAddress", "Level 8, Tech Park Outer Ring Road, Bengaluru, KA 560103",
                "pfEstNumber", "MHBAN0045892000",
                "esiNumber", "31000123450000101",
                "pan", "AAACA0123P",
                "tan", "BLRA01234D",
                "gstin", "29AAACA0123P1Z5"
        ));
    }
}
