package com.hrms.repository;

import com.hrms.entity.Appraisal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AppraisalRepository extends JpaRepository<Appraisal, UUID> {
    List<Appraisal> findByAppraisalYear(String appraisalYear);
    Optional<Appraisal> findByEmployeeIdAndAppraisalYear(UUID employeeId, String appraisalYear);
    List<Appraisal> findByEmployeeId(UUID employeeId);
}
