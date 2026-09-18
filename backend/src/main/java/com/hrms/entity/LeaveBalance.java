package com.hrms.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "leave_balances", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"employee_id", "leave_type", "financial_year"})
})
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "leave_type", nullable = false, length = 30)
    private String leaveType; // CL, SL, EL, ML, PL, COMP_OFF

    @Column(name = "financial_year", nullable = false, length = 15)
    private String financialYear = "2026-2027";

    @Column(name = "opening_balance", precision = 5, scale = 1)
    private BigDecimal openingBalance = BigDecimal.ZERO;

    @Column(precision = 5, scale = 1)
    private BigDecimal accrued = BigDecimal.ZERO;

    @Column(precision = 5, scale = 1)
    private BigDecimal consumed = BigDecimal.ZERO;

    @Column(precision = 5, scale = 1)
    private BigDecimal lapsed = BigDecimal.ZERO;

    public LeaveBalance() {}

    public LeaveBalance(Employee employee, String leaveType, String financialYear, BigDecimal openingBalance, BigDecimal accrued, BigDecimal consumed) {
        this.employee = employee;
        this.leaveType = leaveType;
        this.financialYear = financialYear;
        this.openingBalance = openingBalance;
        this.accrued = accrued;
        this.consumed = consumed;
        this.lapsed = BigDecimal.ZERO;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public String getLeaveType() { return leaveType; }
    public void setLeaveType(String leaveType) { this.leaveType = leaveType; }

    public String getFinancialYear() { return financialYear; }
    public void setFinancialYear(String financialYear) { this.financialYear = financialYear; }

    public BigDecimal getOpeningBalance() { return openingBalance; }
    public void setOpeningBalance(BigDecimal openingBalance) { this.openingBalance = openingBalance; }

    public BigDecimal getAccrued() { return accrued; }
    public void setAccrued(BigDecimal accrued) { this.accrued = accrued; }

    public BigDecimal getConsumed() { return consumed; }
    public void setConsumed(BigDecimal consumed) { this.consumed = consumed; }

    public BigDecimal getLapsed() { return lapsed; }
    public void setLapsed(BigDecimal lapsed) { this.lapsed = lapsed; }

    public BigDecimal getAvailableBalance() {
        return openingBalance.add(accrued).subtract(consumed).subtract(lapsed);
    }
}
