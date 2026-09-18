package com.hrms.service;

import com.hrms.dto.ClearanceRequest;
import com.hrms.dto.FnFComputeRequest;
import com.hrms.dto.ResignationRequest;
import com.hrms.entity.*;
import com.hrms.exception.ClearancePendingException;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.EmployeeRepository;
import com.hrms.repository.ExitRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class ExitService {

    private final ExitRecordRepository exitRecordRepository;
    private final EmployeeRepository employeeRepository;
    private final LeaveService leaveService;
    private final AuditService auditService;

    public ExitService(ExitRecordRepository exitRecordRepository,
                       EmployeeRepository employeeRepository,
                       LeaveService leaveService,
                       AuditService auditService) {
        this.exitRecordRepository = exitRecordRepository;
        this.employeeRepository = employeeRepository;
        this.leaveService = leaveService;
        this.auditService = auditService;
    }

    public List<ExitRecord> getAllExits() {
        return exitRecordRepository.findAll();
    }

    public Optional<ExitRecord> getExitByEmployee(UUID employeeId) {
        return exitRecordRepository.findByEmployeeId(employeeId);
    }

    @Transactional
    public ExitRecord submitResignation(UUID employeeId, ResignationRequest request) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        int noticeDays = 60; // 60 days standard
        LocalDate lwd = request.getResignationDate().plusDays(noticeDays);

        ExitRecord exit = exitRecordRepository.findByEmployeeId(employeeId)
                .orElse(new ExitRecord());

        exit.setEmployee(employee);
        exit.setResignationDate(request.getResignationDate());
        exit.setLastWorkingDay(lwd);
        exit.setNoticePeriodDays(noticeDays);
        exit.setExitInterviewNotes(request.getReason());
        exit.setFnfStatus("PENDING");

        employee.setStatus("NOTICE_PERIOD");
        employeeRepository.save(employee);

        ExitRecord saved = exitRecordRepository.save(exit);
        auditService.log(employee.getId(), employee.getEmail(), "SUBMIT_RESIGNATION", "ExitRecord",
                saved.getId().toString(), "Resigned with LWD: " + lwd);
        return saved;
    }

    @Transactional
    public ExitRecord updateClearance(UUID exitId, ClearanceRequest req, String actorEmail) {
        ExitRecord exit = exitRecordRepository.findById(exitId)
                .orElseThrow(() -> new ResourceNotFoundException("Exit record not found"));

        if ("IT".equalsIgnoreCase(req.getDepartment())) exit.setItClearance(req.isCleared());
        if ("ADMIN".equalsIgnoreCase(req.getDepartment())) exit.setAdminClearance(req.isCleared());
        if ("FINANCE".equalsIgnoreCase(req.getDepartment())) exit.setFinanceClearance(req.isCleared());
        if ("HR".equalsIgnoreCase(req.getDepartment())) exit.setHrClearance(req.isCleared());

        ExitRecord saved = exitRecordRepository.save(exit);
        auditService.log(null, actorEmail, "UPDATE_CLEARANCE", "ExitRecord", saved.getId().toString(),
                "Updated " + req.getDepartment() + " clearance: " + req.isCleared());
        return saved;
    }

    @Transactional
    public ExitRecord computeFnF(UUID exitId, FnFComputeRequest req, String actorEmail) {
        ExitRecord exit = exitRecordRepository.findById(exitId)
                .orElseThrow(() -> new ResourceNotFoundException("Exit record not found"));

        // Rule: All clearances must be cleared before FnF can be paid
        BigDecimal totalFnF = req.calculateTotalFnF();
        exit.setFnfAmount(totalFnF);
        exit.setFnfStatus("COMPUTED");

        ExitRecord saved = exitRecordRepository.save(exit);
        auditService.log(null, actorEmail, "COMPUTE_FNF", "ExitRecord", saved.getId().toString(),
                "Computed FnF total: " + totalFnF);
        return saved;
    }

    @Transactional
    public ExitRecord disburseFnF(UUID exitId, String actorEmail) {
        ExitRecord exit = exitRecordRepository.findById(exitId)
                .orElseThrow(() -> new ResourceNotFoundException("Exit record not found"));

        if (!exit.isAllCleared()) {
            throw new ClearancePendingException("Cannot disburse FnF: Department clearances are still pending!");
        }

        exit.setFnfStatus("PAID");
        Employee employee = exit.getEmployee();
        employee.setStatus("EXITED");
        employeeRepository.save(employee);

        ExitRecord saved = exitRecordRepository.save(exit);
        auditService.log(null, actorEmail, "DISBURSE_FNF", "ExitRecord", saved.getId().toString(),
                "FnF disbursed and employee marked EXITED");
        return saved;
    }
}
