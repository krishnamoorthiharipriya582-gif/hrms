package com.hrms.service;

import com.hrms.dto.AppraisalRatingRequest;
import com.hrms.entity.Appraisal;
import com.hrms.entity.Employee;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.AppraisalRepository;
import com.hrms.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
public class PerformanceService {

    private final AppraisalRepository appraisalRepository;
    private final EmployeeRepository employeeRepository;
    private final AuditService auditService;

    public PerformanceService(AppraisalRepository appraisalRepository,
                              EmployeeRepository employeeRepository,
                              AuditService auditService) {
        this.appraisalRepository = appraisalRepository;
        this.employeeRepository = employeeRepository;
        this.auditService = auditService;
    }

    public List<Appraisal> getAllAppraisals(String year) {
        String appraisalYear = (year != null) ? year : "2025-2026";
        return appraisalRepository.findByAppraisalYear(appraisalYear);
    }

    public List<Appraisal> getEmployeeAppraisals(UUID employeeId) {
        return appraisalRepository.findByEmployeeId(employeeId);
    }

    public Appraisal getOrCreateAppraisal(UUID employeeId, String year) {
        String appraisalYear = (year != null) ? year : "2025-2026";
        return appraisalRepository.findByEmployeeIdAndAppraisalYear(employeeId, appraisalYear)
                .orElseGet(() -> {
                    Employee emp = employeeRepository.findById(employeeId)
                            .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
                    Appraisal a = new Appraisal(emp, appraisalYear);
                    return appraisalRepository.save(a);
                });
    }

    @Transactional
    public Appraisal setGoals(UUID appraisalId, String goalsJson) {
        Appraisal a = appraisalRepository.findById(appraisalId)
                .orElseThrow(() -> new ResourceNotFoundException("Appraisal not found"));
        a.setGoalsJson(goalsJson);
        a.setStatus("MID_YEAR");
        return appraisalRepository.save(a);
    }

    @Transactional
    public Appraisal submitSelfAssessment(UUID appraisalId, BigDecimal rating, String comments) {
        validateRating(rating);
        Appraisal a = appraisalRepository.findById(appraisalId)
                .orElseThrow(() -> new ResourceNotFoundException("Appraisal not found"));
        a.setEmployeeRating(rating);
        a.setFeedback("Self: " + comments);
        a.setStatus("MANAGER_REVIEW");
        return appraisalRepository.save(a);
    }

    @Transactional
    public Appraisal submitManagerReview(UUID appraisalId, AppraisalRatingRequest req, String actorEmail) {
        validateRating(req.getRating());
        Appraisal a = appraisalRepository.findById(appraisalId)
                .orElseThrow(() -> new ResourceNotFoundException("Appraisal not found"));
        a.setManagerRating(req.getRating());
        a.setFeedback(a.getFeedback() + " | Manager: " + req.getFeedback());
        a.setStatus("HR_NORM");

        // Suggest increment based on band
        if (req.getIncrementPct() != null) {
            a.setIncrementPct(req.getIncrementPct());
        } else {
            if (req.getRating().compareTo(new BigDecimal("4.5")) >= 0) a.setIncrementPct(new BigDecimal("15.0"));
            else if (req.getRating().compareTo(new BigDecimal("3.5")) >= 0) a.setIncrementPct(new BigDecimal("10.0"));
            else if (req.getRating().compareTo(new BigDecimal("2.5")) >= 0) a.setIncrementPct(new BigDecimal("6.0"));
            else a.setIncrementPct(BigDecimal.ZERO);
        }

        Appraisal saved = appraisalRepository.save(a);
        auditService.log(null, actorEmail, "MANAGER_APPRAISAL", "Appraisal", saved.getId().toString(),
                "Rated employee " + saved.getEmployee().getFullName() + " with " + req.getRating());
        return saved;
    }

    @Transactional
    public Appraisal finalizeAppraisal(UUID appraisalId, BigDecimal finalRating, BigDecimal incrementPct, String actorEmail) {
        validateRating(finalRating);
        Appraisal a = appraisalRepository.findById(appraisalId)
                .orElseThrow(() -> new ResourceNotFoundException("Appraisal not found"));
        a.setFinalRating(finalRating);
        a.setIncrementPct(incrementPct);
        a.setStatus("CLOSED");

        // Apply increment to basic salary / CTC
        if (incrementPct != null && incrementPct.compareTo(BigDecimal.ZERO) > 0) {
            Employee emp = a.getEmployee();
            BigDecimal multiplier = BigDecimal.ONE.add(incrementPct.divide(BigDecimal.valueOf(100), 4, java.math.RoundingMode.HALF_UP));
            emp.setCtc(emp.getCtc().multiply(multiplier).setScale(2, java.math.RoundingMode.HALF_UP));
            employeeRepository.save(emp);
        }

        Appraisal saved = appraisalRepository.save(a);
        auditService.log(null, actorEmail, "HR_NORM_APPRAISAL", "Appraisal", saved.getId().toString(),
                "Finalized appraisal with rating " + finalRating + " and " + incrementPct + "% increment");
        return saved;
    }

    public Map<String, Object> getBellCurveStats(String year) {
        List<Appraisal> appraisals = getAllAppraisals(year);
        int total = appraisals.size();
        long rating5 = appraisals.stream().filter(a -> a.getManagerRating() != null && a.getManagerRating().compareTo(new BigDecimal("4.5")) >= 0).count();
        long rating4 = appraisals.stream().filter(a -> a.getManagerRating() != null && a.getManagerRating().compareTo(new BigDecimal("3.5")) >= 0 && a.getManagerRating().compareTo(new BigDecimal("4.5")) < 0).count();
        long rating3 = appraisals.stream().filter(a -> a.getManagerRating() != null && a.getManagerRating().compareTo(new BigDecimal("2.5")) >= 0 && a.getManagerRating().compareTo(new BigDecimal("3.5")) < 0).count();
        long rating2or1 = appraisals.stream().filter(a -> a.getManagerRating() != null && a.getManagerRating().compareTo(new BigDecimal("2.5")) < 0).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAppraisals", total);
        stats.put("outstanding", rating5);
        stats.put("exceeds", rating4);
        stats.put("meets", rating3);
        stats.put("needsImprovement", rating2or1);
        return stats;
    }

    private void validateRating(BigDecimal rating) {
        if (rating == null || rating.compareTo(new BigDecimal("1.0")) < 0 || rating.compareTo(new BigDecimal("5.0")) > 0) {
            throw new IllegalArgumentException("Appraisal rating must be between 1.0 and 5.0");
        }
    }
}
