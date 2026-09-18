package com.hrms.service;

import com.hrms.entity.Employee;
import com.hrms.entity.TrainingRecord;
import com.hrms.exception.ResourceNotFoundException;
import com.hrms.repository.EmployeeRepository;
import com.hrms.repository.TrainingRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class TrainingService {

    private final TrainingRecordRepository trainingRecordRepository;
    private final EmployeeRepository employeeRepository;
    private final AuditService auditService;

    public TrainingService(TrainingRecordRepository trainingRecordRepository,
                           EmployeeRepository employeeRepository,
                           AuditService auditService) {
        this.trainingRecordRepository = trainingRecordRepository;
        this.employeeRepository = employeeRepository;
        this.auditService = auditService;
    }

    public List<TrainingRecord> getAllTrainings() {
        return trainingRecordRepository.findAll();
    }

    public List<TrainingRecord> getEmployeeTrainings(UUID employeeId) {
        return trainingRecordRepository.findByEmployeeId(employeeId);
    }

    @Transactional
    public TrainingRecord enrollEmployee(UUID employeeId, String programmeName, String trainerName, LocalDate date, String mode) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        TrainingRecord tr = new TrainingRecord(programmeName, trainerName, date, mode, employee);
        return trainingRecordRepository.save(tr);
    }

    @Transactional
    public TrainingRecord markCompletion(UUID trainingId, boolean completed, Integer feedbackScore, String actorEmail) {
        TrainingRecord tr = trainingRecordRepository.findById(trainingId)
                .orElseThrow(() -> new ResourceNotFoundException("Training record not found"));

        if (completed) {
            tr.setStatus("COMPLETED");
            tr.setCertificateCode("CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            tr.setFeedbackScore(feedbackScore);
        } else {
            tr.setStatus("ABSENT");
        }

        TrainingRecord saved = trainingRecordRepository.save(tr);
        auditService.log(null, actorEmail, "COMPLETE_TRAINING", "TrainingRecord", saved.getId().toString(),
                "Training completion marked for " + saved.getProgrammeName());
        return saved;
    }
}
