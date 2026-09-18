package com.hrms.controller;

import com.hrms.dto.EmployeeDto;
import com.hrms.entity.Employee;
import com.hrms.service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees(@RequestParam(required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(employeeService.searchEmployees(search));
        }
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable UUID id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @GetMapping("/by-email/{email}")
    public ResponseEntity<Employee> getEmployeeByEmail(@PathVariable String email) {
        return employeeService.getEmployeeByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody EmployeeDto dto, Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "system";
        return ResponseEntity.ok(employeeService.createEmployee(dto, actor));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable UUID id, @RequestBody EmployeeDto dto, Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "system";
        return ResponseEntity.ok(employeeService.updateEmployee(id, dto, actor));
    }

    @GetMapping("/hierarchy")
    public ResponseEntity<List<Map<String, Object>>> getHierarchy() {
        return ResponseEntity.ok(employeeService.getOrgHierarchy());
    }

    @PostMapping("/{id}/tax-regime")
    public ResponseEntity<?> updateTaxRegime(@PathVariable UUID id, @RequestParam String regime) {
        employeeService.updateTaxRegime(id, regime);
        return ResponseEntity.ok(Map.of("message", "Tax regime updated successfully to " + regime));
    }
}
