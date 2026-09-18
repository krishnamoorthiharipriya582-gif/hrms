package com.hrms.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "exit_records", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"employee_id"})
})
public class ExitRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "resignation_date", nullable = false)
    private LocalDate resignationDate;

    @Column(name = "last_working_day", nullable = false)
    private LocalDate lastWorkingDay;

    @Column(name = "notice_period_days")
    private int noticePeriodDays = 60;

    @Column(name = "exit_type", nullable = false, length = 30)
    private String exitType = "RESIGNATION"; // RESIGNATION, TERMINATION, RETIREMENT, ABSCONDING

    @Column(name = "it_clearance")
    private boolean itClearance = false;

    @Column(name = "admin_clearance")
    private boolean adminClearance = false;

    @Column(name = "finance_clearance")
    private boolean financeClearance = false;

    @Column(name = "hr_clearance")
    private boolean hrClearance = false;

    @Column(name = "fnf_amount", precision = 10, scale = 2)
    private BigDecimal fnfAmount;

    @Column(name = "fnf_status", length = 30)
    private String fnfStatus = "PENDING"; // PENDING, COMPUTED, PAID

    @Column(name = "exit_interview_submitted")
    private boolean exitInterviewSubmitted = false;

    @Column(name = "exit_interview_notes", columnDefinition = "TEXT")
    private String exitInterviewNotes;

    public ExitRecord() {}

    public ExitRecord(Employee employee, LocalDate resignationDate, LocalDate lastWorkingDay, int noticePeriodDays) {
        this.employee = employee;
        this.resignationDate = resignationDate;
        this.lastWorkingDay = lastWorkingDay;
        this.noticePeriodDays = noticePeriodDays;
        this.exitType = "RESIGNATION";
        this.fnfStatus = "PENDING";
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public LocalDate getResignationDate() { return resignationDate; }
    public void setResignationDate(LocalDate resignationDate) { this.resignationDate = resignationDate; }

    public LocalDate getLastWorkingDay() { return lastWorkingDay; }
    public void setLastWorkingDay(LocalDate lastWorkingDay) { this.lastWorkingDay = lastWorkingDay; }

    public int getNoticePeriodDays() { return noticePeriodDays; }
    public void setNoticePeriodDays(int noticePeriodDays) { this.noticePeriodDays = noticePeriodDays; }

    public String getExitType() { return exitType; }
    public void setExitType(String exitType) { this.exitType = exitType; }

    public boolean isItClearance() { return itClearance; }
    public void setItClearance(boolean itClearance) { this.itClearance = itClearance; }

    public boolean isAdminClearance() { return adminClearance; }
    public void setAdminClearance(boolean adminClearance) { this.adminClearance = adminClearance; }

    public boolean isFinanceClearance() { return financeClearance; }
    public void setFinanceClearance(boolean financeClearance) { this.financeClearance = financeClearance; }

    public boolean isHrClearance() { return hrClearance; }
    public void setHrClearance(boolean hrClearance) { this.hrClearance = hrClearance; }

    public boolean isAllCleared() {
        return itClearance && adminClearance && financeClearance && hrClearance;
    }

    public BigDecimal getFnfAmount() { return fnfAmount; }
    public void setFnfAmount(BigDecimal fnfAmount) { this.fnfAmount = fnfAmount; }

    public String getFnfStatus() { return fnfStatus; }
    public void setFnfStatus(String fnfStatus) { this.fnfStatus = fnfStatus; }

    public boolean isExitInterviewSubmitted() { return exitInterviewSubmitted; }
    public void setExitInterviewSubmitted(boolean exitInterviewSubmitted) { this.exitInterviewSubmitted = exitInterviewSubmitted; }

    public String getExitInterviewNotes() { return exitInterviewNotes; }
    public void setExitInterviewNotes(String exitInterviewNotes) { this.exitInterviewNotes = exitInterviewNotes; }
}
