package com.hrms.dto;

import java.math.BigDecimal;

public class Form12BBRequest {
    private String taxRegime; // NEW, OLD
    private BigDecimal section80C = BigDecimal.ZERO; // PPF, ELSS, Life Insurance
    private BigDecimal section80D = BigDecimal.ZERO; // Health Insurance
    private BigDecimal hraRentPaid = BigDecimal.ZERO;
    private BigDecimal homeLoanInterest = BigDecimal.ZERO;
    private BigDecimal npsContribution = BigDecimal.ZERO;

    public Form12BBRequest() {}

    public String getTaxRegime() { return taxRegime; }
    public void setTaxRegime(String taxRegime) { this.taxRegime = taxRegime; }

    public BigDecimal getSection80C() { return section80C; }
    public void setSection80C(BigDecimal section80C) { this.section80C = section80C; }

    public BigDecimal getSection80D() { return section80D; }
    public void setSection80D(BigDecimal section80D) { this.section80D = section80D; }

    public BigDecimal getHraRentPaid() { return hraRentPaid; }
    public void setHraRentPaid(BigDecimal hraRentPaid) { this.hraRentPaid = hraRentPaid; }

    public BigDecimal getHomeLoanInterest() { return homeLoanInterest; }
    public void setHomeLoanInterest(BigDecimal homeLoanInterest) { this.homeLoanInterest = homeLoanInterest; }

    public BigDecimal getNpsContribution() { return npsContribution; }
    public void setNpsContribution(BigDecimal npsContribution) { this.npsContribution = npsContribution; }
}
