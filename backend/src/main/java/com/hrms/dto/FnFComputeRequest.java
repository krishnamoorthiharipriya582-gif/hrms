package com.hrms.dto;

import java.math.BigDecimal;
import java.util.UUID;

public class FnFComputeRequest {
    private UUID employeeId;
    private BigDecimal pendingSalary = BigDecimal.ZERO;
    private BigDecimal elEncashment = BigDecimal.ZERO;
    private BigDecimal gratuity = BigDecimal.ZERO;
    private BigDecimal loanRecovery = BigDecimal.ZERO;
    private BigDecimal noticeShortfallDeduction = BigDecimal.ZERO;

    public FnFComputeRequest() {}

    public UUID getEmployeeId() { return employeeId; }
    public void setEmployeeId(UUID employeeId) { this.employeeId = employeeId; }

    public BigDecimal getPendingSalary() { return pendingSalary; }
    public void setPendingSalary(BigDecimal pendingSalary) { this.pendingSalary = pendingSalary; }

    public BigDecimal getElEncashment() { return elEncashment; }
    public void setElEncashment(BigDecimal elEncashment) { this.elEncashment = elEncashment; }

    public BigDecimal getGratuity() { return gratuity; }
    public void setGratuity(BigDecimal gratuity) { this.gratuity = gratuity; }

    public BigDecimal getLoanRecovery() { return loanRecovery; }
    public void setLoanRecovery(BigDecimal loanRecovery) { this.loanRecovery = loanRecovery; }

    public BigDecimal getNoticeShortfallDeduction() { return noticeShortfallDeduction; }
    public void setNoticeShortfallDeduction(BigDecimal noticeShortfallDeduction) { this.noticeShortfallDeduction = noticeShortfallDeduction; }

    public BigDecimal calculateTotalFnF() {
        BigDecimal earnings = pendingSalary.add(elEncashment).add(gratuity);
        BigDecimal deductions = loanRecovery.add(noticeShortfallDeduction);
        return earnings.subtract(deductions);
    }
}
