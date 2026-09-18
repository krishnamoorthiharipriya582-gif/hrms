package com.hrms.repository;

import com.hrms.entity.CandidateOnboarding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CandidateOnboardingRepository extends JpaRepository<CandidateOnboarding, UUID> {
    Optional<CandidateOnboarding> findByEmail(String email);
    List<CandidateOnboarding> findByOfferStatus(String offerStatus);
}
