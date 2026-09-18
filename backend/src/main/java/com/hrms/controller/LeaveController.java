package com.hrms.controller;

import com.hrms.dto.LeaveActionRequest;
import com.hrms.dto.LeaveApplyRequest;
import com.hrms.entity.LeaveApplication;
import com.hrms.entity.LeaveBalance;
import com.hrms.service.LeaveService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/leave")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @GetMapping("/balance")
    public ResponseEntity<List<LeaveBalance>> getBalance(
            @RequestParam UUID employeeId,
            @RequestParam(required = false) String financialYear) {
        return ResponseEntity.ok(leaveService.getBalances(employeeId, financialYear));
    }

    @GetMapping("/my-leaves/{employeeId}")
    public ResponseEntity<List<LeaveApplication>> getMyLeaves(@PathVariable UUID employeeId) {
        return ResponseEntity.ok(leaveService.getEmployeeLeaves(employeeId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<LeaveApplication>> getPendingLeaves(@RequestParam(required = false) UUID managerId) {
        if (managerId != null) {
            return ResponseEntity.ok(leaveService.getPendingForManager(managerId));
        }
        return ResponseEntity.ok(leaveService.getAllLeaves());
    }

    @PostMapping("/apply")
    public ResponseEntity<LeaveApplication> applyLeave(
            @RequestParam UUID employeeId,
            @RequestBody LeaveApplyRequest request) {
        return ResponseEntity.ok(leaveService.applyLeave(employeeId, request));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<LeaveApplication> approveLeave(
            @PathVariable UUID id,
            @RequestBody(required = false) LeaveActionRequest req,
            Authentication authentication) {
        LeaveActionRequest actionReq = req != null ? req : new LeaveActionRequest();
        actionReq.setStatus("APPROVED");
        String actor = authentication != null ? authentication.getName() : "manager";
        return ResponseEntity.ok(leaveService.actionLeave(id, actionReq, actor));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<LeaveApplication> rejectLeave(
            @PathVariable UUID id,
            @RequestBody(required = false) LeaveActionRequest req,
            Authentication authentication) {
        LeaveActionRequest actionReq = req != null ? req : new LeaveActionRequest();
        actionReq.setStatus("REJECTED");
        String actor = authentication != null ? authentication.getName() : "manager";
        return ResponseEntity.ok(leaveService.actionLeave(id, actionReq, actor));
    }

    @GetMapping("/encashment/{employeeId}")
    public ResponseEntity<Map<String, Object>> calculateEncashment(@PathVariable UUID employeeId) {
        return ResponseEntity.ok(leaveService.calculateEncashment(employeeId));
    }
}
