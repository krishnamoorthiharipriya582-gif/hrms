package com.hrms.service;

import com.hrms.entity.HrAuditLog;
import com.hrms.repository.HrAuditLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AuditService {

    private final HrAuditLogRepository auditLogRepository;

    public AuditService(HrAuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(UUID actorId, String actorEmail, String action, String entityType, String entityId, String details) {
        HrAuditLog log = new HrAuditLog(actorId, actorEmail, action, entityType, entityId, details);
        log.setLoggedAt(LocalDateTime.now());
        auditLogRepository.save(log);
    }

    public List<HrAuditLog> getAllLogs() {
        return auditLogRepository.findAllByOrderByLoggedAtDesc();
    }
}
