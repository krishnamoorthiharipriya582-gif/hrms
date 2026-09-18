package com.hrms.service;

import com.hrms.dto.PunchRequest;
import com.hrms.dto.RegularisationRequest;
import com.hrms.entity.*;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.AttendanceRecordRepository;
import com.hrms.repository.EmployeeRepository;
import com.hrms.repository.HolidayRepository;
import com.hrms.repository.ShiftRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class AttendanceService {

    private final AttendanceRecordRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final ShiftRepository shiftRepository;
    private final HolidayRepository holidayRepository;
    private final AuditService auditService;

    public AttendanceService(AttendanceRecordRepository attendanceRepository,
                             EmployeeRepository employeeRepository,
                             ShiftRepository shiftRepository,
                             HolidayRepository holidayRepository,
                             AuditService auditService) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
        this.shiftRepository = shiftRepository;
        this.holidayRepository = holidayRepository;
        this.auditService = auditService;
    }

    @Transactional
    public AttendanceRecord punch(UUID employeeId, PunchRequest request) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + employeeId));

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        AttendanceRecord record = attendanceRepository.findByEmployeeIdAndWorkDate(employeeId, today)
                .orElse(null);

        if (record == null) {
            record = new AttendanceRecord();
            record.setEmployee(employee);
            record.setWorkDate(today);
            record.setInPunch(now);
            record.setSource(request.getSource() != null ? request.getSource() : "MOBILE");
            record.setLatitude(request.getLatitude());
            record.setLongitude(request.getLongitude());
            record.setRemarks(request.getRemarks());

            // Check shift timing for late arrival
            LocalTime shiftStart = LocalTime.of(9, 30);
            if (now.isAfter(shiftStart.plusMinutes(15))) {
                record.setStatus("LATE");
            } else {
                record.setStatus("PRESENT");
            }
        } else {
            record.setOutPunch(now);
            if (record.getInPunch() != null) {
                long hoursWorked = ChronoUnit.HOURS.between(record.getInPunch(), now);
                if (hoursWorked < 4) {
                    record.setStatus("HALF_DAY");
                } else if (!"LATE".equals(record.getStatus())) {
                    record.setStatus("PRESENT");
                }
            }
        }

        return attendanceRepository.save(record);
    }

    public Optional<AttendanceRecord> getTodayPunch(UUID employeeId) {
        return attendanceRepository.findByEmployeeIdAndWorkDate(employeeId, LocalDate.now());
    }

    public List<AttendanceRecord> getAttendanceForMonth(UUID employeeId, String yearMonthStr) {
        YearMonth ym = YearMonth.parse(yearMonthStr);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        return attendanceRepository.findByEmployeeIdAndWorkDateBetween(employeeId, start, end);
    }

    public Map<String, Object> getMonthlySummary(UUID employeeId, String yearMonthStr) {
        YearMonth ym = YearMonth.parse(yearMonthStr);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        List<AttendanceRecord> records = attendanceRepository.findByEmployeeIdAndWorkDateBetween(employeeId, start, end);

        long presentCount = records.stream().filter(r -> "PRESENT".equals(r.getStatus())).count();
        long lateCount = records.stream().filter(r -> "LATE".equals(r.getStatus())).count();
        long halfDayCount = records.stream().filter(r -> "HALF_DAY".equals(r.getStatus())).count();
        long lopCount = records.stream().filter(r -> "LOP".equals(r.getStatus()) || "ABSENT".equals(r.getStatus())).count();
        long leaveCount = records.stream().filter(r -> "LEAVE".equals(r.getStatus())).count();

        Map<String, Object> summary = new HashMap<>();
        summary.put("month", yearMonthStr);
        summary.put("totalDays", records.size());
        summary.put("present", presentCount + lateCount);
        summary.put("late", lateCount);
        summary.put("halfDay", halfDayCount);
        summary.put("absent", lopCount);
        summary.put("leave", leaveCount);
        summary.put("lopDays", lopCount);
        return summary;
    }

    @Transactional
    public AttendanceRecord applyRegularisation(UUID employeeId, RegularisationRequest request) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        // Validation rule: Must be applied within 7 days of punch date
        if (request.getWorkDate().isBefore(LocalDate.now().minusDays(7))) {
            throw new IllegalArgumentException("Regularisation window expired: must be applied within 7 days");
        }

        AttendanceRecord record = attendanceRepository.findByEmployeeIdAndWorkDate(employeeId, request.getWorkDate())
                .orElseGet(() -> {
                    AttendanceRecord ar = new AttendanceRecord();
                    ar.setEmployee(employee);
                    ar.setWorkDate(request.getWorkDate());
                    ar.setStatus("ABSENT");
                    return ar;
                });

        record.setInPunch(request.getInPunch() != null ? request.getInPunch() : LocalTime.of(9, 30));
        record.setOutPunch(request.getOutPunch() != null ? request.getOutPunch() : LocalTime.of(18, 30));
        record.setRegularisationReason(request.getReason());
        record.setRegularisationStatus("PENDING");
        record.setSource("REGULARISED");

        return attendanceRepository.save(record);
    }

    @Transactional
    public AttendanceRecord actionRegularisation(UUID attendanceId, boolean approve, String actorEmail) {
        AttendanceRecord record = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found"));

        if (approve) {
            record.setRegularisationStatus("APPROVED");
            record.setStatus("PRESENT");
        } else {
            record.setRegularisationStatus("REJECTED");
        }

        AttendanceRecord saved = attendanceRepository.save(record);
        auditService.log(null, actorEmail, "ACTION_REGULARISATION", "Attendance", saved.getId().toString(),
                (approve ? "Approved" : "Rejected") + " regularisation for date " + saved.getWorkDate());
        return saved;
    }

    public List<AttendanceRecord> getPendingRegularisations() {
        return attendanceRepository.findByRegularisationStatus("PENDING");
    }

    public List<Shift> getAllShifts() {
        return shiftRepository.findAll();
    }

    public List<Holiday> getHolidays(int year) {
        LocalDate start = LocalDate.of(year, 1, 1);
        LocalDate end = LocalDate.of(year, 12, 31);
        return holidayRepository.findByHolidayDateBetweenOrderByHolidayDateAsc(start, end);
    }
}
