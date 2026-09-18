package com.hrms.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "payroll_records", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"payroll_run_id", "employee_id"})
})
public class PayrollRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "payroll_run_id", nullable = false)
    private PayrollRun payrollRun;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(precision = 10, scale = 2)
    private BigDecimal gross = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    private BigDecimal basic = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    private BigDecimal hra = BigDecimal.ZERO;

    @Column(precision = 8, scale = 2)
    private BigDecimal conveyance = BigDecimal.ZERO;

    @Column(name = "special_allowance", precision = 10, scale = 2)
    private BigDecimal specialAllowance = BigDecimal.ZERO;

    @Column(name = "lop_days")
    private int lopDays = 0;

    @Column(name = "lop_deduction", precision = 10, scale = 2)
    private BigDecimal lopDeduction = BigDecimal.ZERO;

    @Column(name = "employee_pf", precision = 8, scale = 2)
    private BigDecimal employeePf = BigDecimal.ZERO;

    @Column(name = "employer_pf", precision = 8, scale = 2)
    private BigDecimal employerPf = BigDecimal.ZERO;

    @Column(precision = 8, scale = 2)
    private BigDecimal esi = BigDecimal.ZERO;

    @Column(precision = 8, scale = 2)
    private BigDecimal tds = BigDecimal.ZERO;

    @Column(precision = 6, scale = 2)
    private BigDecimal pt = BigDecimal.ZERO;

    @Column(name = "net_pay", precision = 10, scale = 2)
    private BigDecimal netPay = BigDecimal.ZERO;

    @Column(name = "disbursement_status", length = 30)
    private String disbursementStatus = "PENDING"; // PENDING, PAID, FAILED

    @Column(name = "disbursement_ref", length = 100)
    private String disbursementRef;

    public PayrollRecord() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public PayrollRun getPayrollRun() { return payrollRun; }
    public void setPayrollRun(PayrollRun payrollRun) { this.payrollRun = payrollRun; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public BigDecimal getGross() { return gross; }
    public void setGross(BigDecimal gross) { this.gross = gross; }

    public BigDecimal getBasic() { return basic; }
    public void setBasic(BigDecimal basic) { this.basic = basic; }

    public BigDecimal getHra() { return hra; }
    public void setHra(BigDecimal hra) { this.hra = hra; }

    public BigDecimal getConveyance() { return conveyance; }
    public void setConveyance(BigDecimal conveyance) { this.conveyance = conveyance; }

    public BigDecimal getSpecialAllowance() { return specialAllowance; }
    public void setSpecialAllowance(BigDecimal specialAllowance) { this.specialAllowance = specialAllowance; }

    public int getLopDays() { return lopDays; }
    public void setLopDays(int lopDays) { this.lopDays = lopDays; }

    public BigDecimal getLopDeduction() { return lopDeduction; }
    public void setLopDeduction(BigDecimal lopDeduction) { this.lopDeduction = lopDeduction; }

    public BigDecimal getEmployeePf() { return employeePf; }
    public void setEmployeePf(BigDecimal employeePf) { this.employeePf = employeePf; }

    public BigDecimal getEmployerPf() { return employerPf; }
    public void setEmployerPf(BigDecimal employerPf) { this.employerPf = employerPf; }

    public BigDecimal getEsi() { return esi; }
    public void setEsi(BigDecimal esi) { this.esi = esi; }

    public BigDecimal getTds() { return tds; }
    public void setTds(BigDecimal tds) { this.tds = tds; }

    public BigDecimal getPt() { return pt; }
    public void setPt(BigDecimal pt) { this.pt = pt; }

    public BigDecimal getNetPay() { return netPay; }
    public void setNetPay(BigDecimal netPay) { this.netPay = netPay; }

    public String getDisbursementStatus() { return disbursementStatus; }
    public void setDisbursementStatus(String disbursementStatus) { this.disbursementStatus = disbursementStatus; }

    public String getDisbursementRef() { return disbursementRef; }
    public void setDisbursementRef(String disbursementRef) { this.disbursementRef = disbursementRef; }
}
