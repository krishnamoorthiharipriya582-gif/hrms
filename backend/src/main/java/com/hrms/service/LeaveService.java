package com.hrms.service;

import com.hrms.dto.LeaveActionRequest;
import com.hrms.dto.LeaveApplyRequest;
import com.hrms.entity.*;
import com.hrms.exception.InsufficientLeaveBalanceException;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.EmployeeRepository;
import com.hrms.repository.LeaveApplicationRepository;
import com.hrms.repository.LeaveBalanceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class LeaveService {

    private final LeaveBalanceRepository leaveBalanceRepository;
    private final LeaveApplicationRepository leaveApplicationRepository;
    private final EmployeeRepository employeeRepository;
    private final AuditService auditService;

    public LeaveService(LeaveBalanceRepository leaveBalanceRepository,
                        LeaveApplicationRepository leaveApplicationRepository,
                        EmployeeRepository employeeRepository,
                        AuditService auditService) {
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.leaveApplicationRepository = leaveApplicationRepository;
        this.employeeRepository = employeeRepository;
        this.auditService = auditService;
    }

    public List<LeaveBalance> getBalances(UUID employeeId, String financialYear) {
        String fy = (financialYear != null) ? financialYear : "2026-2027";
        return leaveBalanceRepository.findByEmployeeIdAndFinancialYear(employeeId, fy);
    }

    public List<LeaveApplication> getEmployeeLeaves(UUID employeeId) {
        return leaveApplicationRepository.findByEmployeeIdOrderByAppliedAtDesc(employeeId);
    }

    public List<LeaveApplication> getPendingForManager(UUID managerId) {
        return leaveApplicationRepository.findPendingForManager(managerId);
    }

    public List<LeaveApplication> getAllLeaves() {
        return leaveApplicationRepository.findAll();
    }

    @Transactional
    public LeaveApplication applyLeave(UUID employeeId, LeaveApplyRequest request) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + employeeId));

        if (request.getFromDate().isAfter(request.getToDate())) {
            throw new IllegalArgumentException("From date cannot be after to date");
        }

        String fy = "2026-2027";
        LeaveBalance balance = leaveBalanceRepository
                .findByEmployeeIdAndLeaveTypeAndFinancialYear(employeeId, request.getLeaveType(), fy)
                .orElse(null);

        if (balance != null) {
            BigDecimal available = balance.getAvailableBalance();
            if (available.compareTo(request.getDays()) < 0) {
                throw new InsufficientLeaveBalanceException(
                        "Insufficient leave balance for " + request.getLeaveType() +
                        ". Available: " + available + ", Requested: " + request.getDays()
                );
            }
        }

        LeaveApplication application = new LeaveApplication(
                employee,
                request.getLeaveType(),
                request.getFromDate(),
                request.getToDate(),
                request.getDays(),
                request.getReason()
        );

        LeaveApplication saved = leaveApplicationRepository.save(application);
        auditService.log(employee.getId(), employee.getEmail(), "APPLY_LEAVE", "LeaveApplication",
                saved.getId().toString(), "Applied for " + request.getDays() + " days " + request.getLeaveType());
        return saved;
    }

    @Transactional
    public LeaveApplication actionLeave(UUID applicationId, LeaveActionRequest request, String actorEmail) {
        LeaveApplication application = leaveApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave application not found: " + applicationId));

        application.setStatus(request.getStatus());
        application.setManagerComments(request.getManagerComments());
        application.setActionedAt(LocalDateTime.now());

        if ("APPROVED".equalsIgnoreCase(request.getStatus())) {
            String fy = "2026-2027";
            LeaveBalance balance = leaveBalanceRepository
                    .findByEmployeeIdAndLeaveTypeAndFinancialYear(application.getEmployee().getId(), application.getLeaveType(), fy)
                    .orElse(null);

            if (balance != null) {
                balance.setConsumed(balance.getConsumed().add(application.getDays()));
                leaveBalanceRepository.save(balance);
            }
        }

        LeaveApplication saved = leaveApplicationRepository.save(application);
        auditService.log(null, actorEmail, "ACTION_LEAVE", "LeaveApplication",
                saved.getId().toString(), "Leave status set to " + request.getStatus());
        return saved;
    }

    public Map<String, Object> calculateEncashment(UUID employeeId) {
        Employee emp = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        LeaveBalance elBalance = leaveBalanceRepository
                .findByEmployeeIdAndLeaveTypeAndFinancialYear(employeeId, "EL", "2026-2027")
                .orElse(null);

        BigDecimal unusedEl = (elBalance != null) ? elBalance.getAvailableBalance() : BigDecimal.ZERO;
        BigDecimal monthlyGross = emp.getCtc().divide(BigDecimal.valueOf(12), 2, java.math.RoundingMode.HALF_UP);
        BigDecimal basicSalary = monthlyGross.multiply(new BigDecimal("0.40"));
        BigDecimal dailyBasic = basicSalary.divide(BigDecimal.valueOf(26), 2, java.math.RoundingMode.HALF_UP);
        BigDecimal encashmentAmount = dailyBasic.multiply(unusedEl).setScale(2, java.math.RoundingMode.HALF_UP);

        Map<String, Object> result = new HashMap<>();
        result.put("employeeId", employeeId);
        result.put("employeeName", emp.getFullName());
        result.put("unusedEL", unusedEl);
        result.put("dailyBasic", dailyBasic);
        result.put("encashmentAmount", encashmentAmount);
        return result;
    }
}
