package com.hrms.repository;

import com.hrms.entity.ExitRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExitRecordRepository extends JpaRepository<ExitRecord, UUID> {
    Optional<ExitRecord> findByEmployeeId(UUID employeeId);
}
