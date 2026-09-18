package com.hrms.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "salary_structures")
public class SalaryStructure {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 20)
    private String grade;

    @Column(name = "effective_from")
    private LocalDate effectiveFrom;

    @Column(name = "basic_pct", precision = 5, scale = 2)
    private BigDecimal basicPct = new BigDecimal("40.00");

    @Column(name = "hra_pct", precision = 5, scale = 2)
    private BigDecimal hraPct = new BigDecimal("20.00");

    @Column(precision = 8, scale = 2)
    private BigDecimal conveyance = new BigDecimal("1600.00");

    @Column(name = "special_allowance_pct", precision = 5, scale = 2)
    private BigDecimal specialAllowancePct = new BigDecimal("40.00");

    @Column(name = "is_active")
    private boolean active = true;

    public SalaryStructure() {}

    public SalaryStructure(String grade, LocalDate effectiveFrom, BigDecimal basicPct, BigDecimal hraPct, BigDecimal conveyance, BigDecimal specialAllowancePct) {
        this.grade = grade;
        this.effectiveFrom = effectiveFrom;
        this.basicPct = basicPct;
        this.hraPct = hraPct;
        this.conveyance = conveyance;
        this.specialAllowancePct = specialAllowancePct;
        this.active = true;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public LocalDate getEffectiveFrom() { return effectiveFrom; }
    public void setEffectiveFrom(LocalDate effectiveFrom) { this.effectiveFrom = effectiveFrom; }

    public BigDecimal getBasicPct() { return basicPct; }
    public void setBasicPct(BigDecimal basicPct) { this.basicPct = basicPct; }

    public BigDecimal getHraPct() { return hraPct; }
    public void setHraPct(BigDecimal hraPct) { this.hraPct = hraPct; }

    public BigDecimal getConveyance() { return conveyance; }
    public void setConveyance(BigDecimal conveyance) { this.conveyance = conveyance; }

    public BigDecimal getSpecialAllowancePct() { return specialAllowancePct; }
    public void setSpecialAllowancePct(BigDecimal specialAllowancePct) { this.specialAllowancePct = specialAllowancePct; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
