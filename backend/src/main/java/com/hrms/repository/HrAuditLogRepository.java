package com.hrms.repository;

import com.hrms.entity.HrAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface HrAuditLogRepository extends JpaRepository<HrAuditLog, UUID> {
    List<HrAuditLog> findAllByOrderByLoggedAtDesc();
    List<HrAuditLog> findByEntityTypeOrderByLoggedAtDesc(String entityType);
}
