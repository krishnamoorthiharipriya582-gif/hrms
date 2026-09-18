package com.hrms.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CandidateOnboardingRequest {
    private String candidateName;
    private String email;
    private String phone;
    private String designation;
    private String departmentName;
    private BigDecimal ctc;
    private LocalDate joiningDate;

    public CandidateOnboardingRequest() {}

    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public BigDecimal getCtc() { return ctc; }
    public void setCtc(BigDecimal ctc) { this.ctc = ctc; }

    public LocalDate getJoiningDate() { return joiningDate; }
    public void setJoiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; }
}
