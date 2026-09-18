package com.hrms.controller;

import com.hrms.dto.PayrollRunRequest;
import com.hrms.entity.PayrollRecord;
import com.hrms.entity.PayrollRun;
import com.hrms.service.PayrollService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payroll")
public class PayrollController {

    private final PayrollService payrollService;

    public PayrollController(PayrollService payrollService) {
        this.payrollService = payrollService;
    }

    @GetMapping("/runs")
    public ResponseEntity<List<PayrollRun>> getAllRuns() {
        return ResponseEntity.ok(payrollService.getAllRuns());
    }

    @GetMapping("/runs/{id}")
    public ResponseEntity<PayrollRun> getRunById(@PathVariable UUID id) {
        return ResponseEntity.ok(payrollService.getRunById(id));
    }

    @GetMapping("/runs/{id}/records")
    public ResponseEntity<List<PayrollRecord>> getRecordsForRun(@PathVariable UUID id) {
        return ResponseEntity.ok(payrollService.getRecordsByRunId(id));
    }

    @PostMapping("/run")
    public ResponseEntity<PayrollRun> initiatePayrollRun(
            @RequestBody PayrollRunRequest request,
            Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "hr_manager";
        return ResponseEntity.ok(payrollService.computePayroll(request.getRunMonth(), actor));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<PayrollRun> approvePayroll(
            @PathVariable UUID id,
            Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "cfo_admin";
        return ResponseEntity.ok(payrollService.approvePayroll(id, actor));
    }

    @PostMapping("/{id}/disburse")
    public ResponseEntity<PayrollRun> disbursePayroll(
            @PathVariable UUID id,
            Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "cfo_admin";
        return ResponseEntity.ok(payrollService.disbursePayroll(id, actor));
    }

    @GetMapping("/payslip/{month}")
    public ResponseEntity<PayrollRecord> getPayslipForMonth(
            @PathVariable String month,
            @RequestParam UUID employeeId) {
        return ResponseEntity.ok(payrollService.getEmployeePayslipForMonth(month, employeeId));
    }

    @GetMapping("/my-payslips/{employeeId}")
    public ResponseEntity<List<PayrollRecord>> getMyPayslips(@PathVariable UUID employeeId) {
        return ResponseEntity.ok(payrollService.getEmployeePayslips(employeeId));
    }
}
