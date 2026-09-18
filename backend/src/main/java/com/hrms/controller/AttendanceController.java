package com.hrms.controller;

import com.hrms.dto.PunchRequest;
import com.hrms.dto.RegularisationRequest;
import com.hrms.entity.AttendanceRecord;
import com.hrms.entity.Holiday;
import com.hrms.entity.Shift;
import com.hrms.service.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/punch")
    public ResponseEntity<AttendanceRecord> punch(@RequestParam UUID employeeId, @RequestBody(required = false) PunchRequest request) {
        PunchRequest req = request != null ? request : new PunchRequest();
        return ResponseEntity.ok(attendanceService.punch(employeeId, req));
    }

    @GetMapping("/today")
    public ResponseEntity<AttendanceRecord> getTodayPunch(@RequestParam UUID employeeId) {
        return attendanceService.getTodayPunch(employeeId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/records/{employeeId}")
    public ResponseEntity<List<AttendanceRecord>> getMonthlyRecords(
            @PathVariable UUID employeeId,
            @RequestParam String month) {
        return ResponseEntity.ok(attendanceService.getAttendanceForMonth(employeeId, month));
    }

    @GetMapping("/{month}")
    public ResponseEntity<Map<String, Object>> getMonthlySummary(
            @PathVariable String month,
            @RequestParam UUID employeeId) {
        return ResponseEntity.ok(attendanceService.getMonthlySummary(employeeId, month));
    }

    @PostMapping("/regularise")
    public ResponseEntity<AttendanceRecord> regularise(
            @RequestParam UUID employeeId,
            @RequestBody RegularisationRequest request) {
        return ResponseEntity.ok(attendanceService.applyRegularisation(employeeId, request));
    }

    @GetMapping("/regularisations/pending")
    public ResponseEntity<List<AttendanceRecord>> getPendingRegularisations() {
        return ResponseEntity.ok(attendanceService.getPendingRegularisations());
    }

    @PutMapping("/regularisations/{id}/approve")
    public ResponseEntity<AttendanceRecord> approveRegularisation(
            @PathVariable UUID id,
            Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "manager";
        return ResponseEntity.ok(attendanceService.actionRegularisation(id, true, actor));
    }

    @PutMapping("/regularisations/{id}/reject")
    public ResponseEntity<AttendanceRecord> rejectRegularisation(
            @PathVariable UUID id,
            Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "manager";
        return ResponseEntity.ok(attendanceService.actionRegularisation(id, false, actor));
    }

    @GetMapping("/shifts")
    public ResponseEntity<List<Shift>> getShifts() {
        return ResponseEntity.ok(attendanceService.getAllShifts());
    }

    @GetMapping("/holidays")
    public ResponseEntity<List<Holiday>> getHolidays(@RequestParam(defaultValue = "2026") int year) {
        return ResponseEntity.ok(attendanceService.getHolidays(year));
    }
}
