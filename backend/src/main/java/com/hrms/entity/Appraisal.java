package com.hrms.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "appraisals")
public class Appraisal {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "appraisal_year", nullable = false, length = 15)
    private String appraisalYear = "2025-2026";

    @Column(name = "employee_rating", precision = 3, scale = 1)
    private BigDecimal employeeRating;

    @Column(name = "manager_rating", precision = 3, scale = 1)
    private BigDecimal managerRating;

    @Column(name = "final_rating", precision = 3, scale = 1)
    private BigDecimal finalRating;

    @Column(name = "increment_pct", precision = 5, scale = 2)
    private BigDecimal incrementPct;

    @Column(length = 30, nullable = false)
    private String status = "GOAL_SETTING"; // GOAL_SETTING, MID_YEAR, ANNUAL_SELF, MANAGER_REVIEW, HR_NORM, CLOSED

    @Column(name = "goals_json", columnDefinition = "TEXT")
    private String goalsJson;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    public Appraisal() {}

    public Appraisal(Employee employee, String appraisalYear) {
        this.employee = employee;
        this.appraisalYear = appraisalYear;
        this.status = "GOAL_SETTING";
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public String getAppraisalYear() { return appraisalYear; }
    public void setAppraisalYear(String appraisalYear) { this.appraisalYear = appraisalYear; }

    public BigDecimal getEmployeeRating() { return employeeRating; }
    public void setEmployeeRating(BigDecimal employeeRating) { this.employeeRating = employeeRating; }

    public BigDecimal getManagerRating() { return managerRating; }
    public void setManagerRating(BigDecimal managerRating) { this.managerRating = managerRating; }

    public BigDecimal getFinalRating() { return finalRating; }
    public void setFinalRating(BigDecimal finalRating) { this.finalRating = finalRating; }

    public BigDecimal getIncrementPct() { return incrementPct; }
    public void setIncrementPct(BigDecimal incrementPct) { this.incrementPct = incrementPct; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getGoalsJson() { return goalsJson; }
    public void setGoalsJson(String goalsJson) { this.goalsJson = goalsJson; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
}
 