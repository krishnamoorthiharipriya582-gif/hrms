package com.hrms.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "candidate_onboardings")
public class CandidateOnboarding {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "candidate_name", nullable = false, length = 100)
    private String candidateName;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(nullable = false, length = 100)
    private String designation;

    @Column(name = "department_name", length = 100)
    private String departmentName;

    @Column(precision = 12, scale = 2)
    private BigDecimal ctc;

    @Column(name = "offer_status", length = 30)
    private String offerStatus = "OFFER_SENT"; // OFFER_SENT, ACCEPTED, DECLINED, JOINED

    @Column(name = "esign_status", length = 30)
    private String eSignStatus = "PENDING"; // PENDING, SIGNED

    @Column(name = "bgv_status", length = 30)
    private String bgvStatus = "NOT_INITIATED"; // NOT_INITIATED, INITIATED, VERIFIED, REJECTED

    @Column(name = "id_proof_submitted")
    private boolean idProofSubmitted = false;

    @Column(name = "education_submitted")
    private boolean educationSubmitted = false;

    @Column(name = "experience_submitted")
    private boolean experienceSubmitted = false;

    @Column(name = "laptop_allocated")
    private boolean laptopAllocated = false;

    @Column(name = "access_card_allocated")
    private boolean accessCardAllocated = false;

    @Column(name = "email_provisioned")
    private boolean emailProvisioned = false;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @Column(name = "probation_days")
    private int probationDays = 90;

    public CandidateOnboarding() {}

    public CandidateOnboarding(String candidateName, String email, String phone, String designation, String departmentName, BigDecimal ctc, LocalDate joiningDate) {
        this.candidateName = candidateName;
        this.email = email;
        this.phone = phone;
        this.designation = designation;
        this.departmentName = departmentName;
        this.ctc = ctc;
        this.joiningDate = joiningDate;
        this.offerStatus = "OFFER_SENT";
        this.eSignStatus = "PENDING";
        this.bgvStatus = "NOT_INITIATED";
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

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

    public String getOfferStatus() { return offerStatus; }
    public void setOfferStatus(String offerStatus) { this.offerStatus = offerStatus; }

    public String getESignStatus() { return eSignStatus; }
    public void setESignStatus(String eSignStatus) { this.eSignStatus = eSignStatus; }

    public String getBgvStatus() { return bgvStatus; }
    public void setBgvStatus(String bgvStatus) { this.bgvStatus = bgvStatus; }

    public boolean isIdProofSubmitted() { return idProofSubmitted; }
    public void setIdProofSubmitted(boolean idProofSubmitted) { this.idProofSubmitted = idProofSubmitted; }

    public boolean isEducationSubmitted() { return educationSubmitted; }
    public void setEducationSubmitted(boolean educationSubmitted) { this.educationSubmitted = educationSubmitted; }

    public boolean isExperienceSubmitted() { return experienceSubmitted; }
    public void setExperienceSubmitted(boolean experienceSubmitted) { this.experienceSubmitted = experienceSubmitted; }

    public boolean isLaptopAllocated() { return laptopAllocated; }
    public void setLaptopAllocated(boolean laptopAllocated) { this.laptopAllocated = laptopAllocated; }

    public boolean isAccessCardAllocated() { return accessCardAllocated; }
    public void setAccessCardAllocated(boolean accessCardAllocated) { this.accessCardAllocated = accessCardAllocated; }

    public boolean isEmailProvisioned() { return emailProvisioned; }
    public void setEmailProvisioned(boolean emailProvisioned) { this.emailProvisioned = emailProvisioned; }

    public LocalDate getJoiningDate() { return joiningDate; }
    public void setJoiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; }

    public int getProbationDays() { return probationDays; }
    public void setProbationDays(int probationDays) { this.probationDays = probationDays; }
}
