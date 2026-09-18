package com.hrms.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payroll_runs", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"run_month"})
})
public class PayrollRun {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "run_month", nullable = false, length = 10)
    private String runMonth; // Format: YYYY-MM

    @Column(nullable = false, length = 30)
    private String status = "DRAFT"; // DRAFT, PENDING_APPROVAL, APPROVED, DISBURSED

    @Column(name = "total_gross", precision = 12, scale = 2)
    private BigDecimal totalGross = BigDecimal.ZERO;

    @Column(name = "total_net", precision = 12, scale = 2)
    private BigDecimal totalNet = BigDecimal.ZERO;

    @Column(name = "total_pf", precision = 10, scale = 2)
    private BigDecimal totalPf = BigDecimal.ZERO;

    @Column(name = "total_tds", precision = 10, scale = 2)
    private BigDecimal totalTds = BigDecimal.ZERO;

    @Column(name = "total_esi", precision = 10, scale = 2)
    private BigDecimal totalEsi = BigDecimal.ZERO;

    @Column(name = "initiated_by", length = 100)
    private String initiatedBy;

    @Column(name = "approved_by", length = 100)
    private String approvedBy;

    @Column(name = "run_date")
    private LocalDateTime runDate = LocalDateTime.now();

    public PayrollRun() {}

    public PayrollRun(String runMonth, String initiatedBy) {
        this.runMonth = runMonth;
        this.initiatedBy = initiatedBy;
        this.status = "DRAFT";
        this.runDate = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getRunMonth() { return runMonth; }
    public void setRunMonth(String runMonth) { this.runMonth = runMonth; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getTotalGross() { return totalGross; }
    public void setTotalGross(BigDecimal totalGross) { this.totalGross = totalGross; }

    public BigDecimal getTotalNet() { return totalNet; }
    public void setTotalNet(BigDecimal totalNet) { this.totalNet = totalNet; }

    public BigDecimal getTotalPf() { return totalPf; }
    public void setTotalPf(BigDecimal totalPf) { this.totalPf = totalPf; }

    public BigDecimal getTotalTds() { return totalTds; }
    public void setTotalTds(BigDecimal totalTds) { this.totalTds = totalTds; }

    public BigDecimal getTotalEsi() { return totalEsi; }
    public void setTotalEsi(BigDecimal totalEsi) { this.totalEsi = totalEsi; }

    public String getInitiatedBy() { return initiatedBy; }
    public void setInitiatedBy(String initiatedBy) { this.initiatedBy = initiatedBy; }

    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }

    public LocalDateTime getRunDate() { return runDate; }
    public void setRunDate(LocalDateTime runDate) { this.runDate = runDate; }
}
