package com.hrms.controller;

import com.hrms.entity.TrainingRecord;
import com.hrms.service.TrainingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/training")
public class TrainingController {

    private final TrainingService trainingService;

    public TrainingController(TrainingService trainingService) {
        this.trainingService = trainingService;
    }

    @GetMapping
    public ResponseEntity<List<TrainingRecord>> getAllTrainings() {
        return ResponseEntity.ok(trainingService.getAllTrainings());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<TrainingRecord>> getEmployeeTrainings(@PathVariable UUID employeeId) {
        return ResponseEntity.ok(trainingService.getEmployeeTrainings(employeeId));
    }

    @PostMapping("/enroll")
    public ResponseEntity<TrainingRecord> enroll(
            @RequestParam UUID employeeId,
            @RequestBody Map<String, String> body) {
        String programme = body.get("programmeName");
        String trainer = body.getOrDefault("trainerName", "Internal Faculty");
        LocalDate date = body.containsKey("trainingDate") ? LocalDate.parse(body.get("trainingDate")) : LocalDate.now().plusDays(7);
        String mode = body.getOrDefault("mode", "ONLINE");
        return ResponseEntity.ok(trainingService.enrollEmployee(employeeId, programme, trainer, date, mode));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<TrainingRecord> complete(
            @PathVariable UUID id,
            @RequestParam boolean completed,
            @RequestParam(required = false) Integer score,
            Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "trainer";
        return ResponseEntity.ok(trainingService.markCompletion(id, completed, score, actor));
    }
}
