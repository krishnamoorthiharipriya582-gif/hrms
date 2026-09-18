package com.hrms.service;

import com.hrms.dto.CandidateOnboardingRequest;
import com.hrms.dto.EmployeeDto;
import com.hrms.entity.CandidateOnboarding;
import com.hrms.entity.Employee;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.CandidateOnboardingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class OnboardingService {

    private final CandidateOnboardingRepository onboardingRepository;
    private final EmployeeService employeeService;
    private final AuditService auditService;

    public OnboardingService(CandidateOnboardingRepository onboardingRepository,
                             EmployeeService employeeService,
                             AuditService auditService) {
        this.onboardingRepository = onboardingRepository;
        this.employeeService = employeeService;
        this.auditService = auditService;
    }

    public List<CandidateOnboarding> getAllCandidates() {
        return onboardingRepository.findAll();
    }

    public CandidateOnboarding getCandidateById(UUID id) {
        return onboardingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found: " + id));
    }

    @Transactional
    public CandidateOnboarding createCandidate(CandidateOnboardingRequest request, String actorEmail) {
        CandidateOnboarding candidate = new CandidateOnboarding(
                request.getCandidateName(),
                request.getEmail(),
                request.getPhone(),
                request.getDesignation(),
                request.getDepartmentName(),
                request.getCtc(),
                request.getJoiningDate()
        );

        CandidateOnboarding saved = onboardingRepository.save(candidate);
        auditService.log(null, actorEmail, "CREATE_CANDIDATE_OFFER", "CandidateOnboarding", saved.getId().toString(),
                "Issued offer to: " + saved.getCandidateName());
        return saved;
    }

    @Transactional
    public CandidateOnboarding simulateESign(UUID candidateId) {
        CandidateOnboarding c = getCandidateById(candidateId);
        c.setESignStatus("SIGNED");
        c.setOfferStatus("ACCEPTED");
        return onboardingRepository.save(c);
    }

    @Transactional
    public CandidateOnboarding verifyDocument(UUID candidateId, String docType, boolean verified) {
        CandidateOnboarding c = getCandidateById(candidateId);
        if ("ID_PROOF".equalsIgnoreCase(docType)) c.setIdProofSubmitted(verified);
        if ("EDUCATION".equalsIgnoreCase(docType)) c.setEducationSubmitted(verified);
        if ("EXPERIENCE".equalsIgnoreCase(docType)) c.setExperienceSubmitted(verified);
        return onboardingRepository.save(c);
    }

    @Transactional
    public CandidateOnboarding updateBgv(UUID candidateId, String status) {
        CandidateOnboarding c = getCandidateById(candidateId);
        c.setBgvStatus(status);
        return onboardingRepository.save(c);
    }

    @Transactional
    public CandidateOnboarding updateAssets(UUID candidateId, boolean laptop, boolean accessCard, boolean email) {
        CandidateOnboarding c = getCandidateById(candidateId);
        c.setLaptopAllocated(laptop);
        c.setAccessCardAllocated(accessCard);
        c.setEmailProvisioned(email);
        return onboardingRepository.save(c);
    }

    @Transactional
    public Employee convertToEmployee(UUID candidateId, String actorEmail) {
        CandidateOnboarding c = getCandidateById(candidateId);
        c.setOfferStatus("JOINED");
        onboardingRepository.save(c);

        EmployeeDto dto = new EmployeeDto();
        String[] parts = c.getCandidateName().split(" ", 2);
        dto.setFirstName(parts[0]);
        dto.setLastName(parts.length > 1 ? parts[1] : "");
        dto.setEmail(c.getEmail());
        dto.setPhone(c.getPhone());
        dto.setDesignation(c.getDesignation());
        dto.setCtc(c.getCtc());
        dto.setDateOfJoining(c.getJoiningDate());
        dto.setStatus("ACTIVE");
        dto.setEmploymentType("PROBATION");

        return employeeService.createEmployee(dto, actorEmail);
    }
}
