package com.hrms.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "training_records")
public class TrainingRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "programme_name", nullable = false, length = 200)
    private String programmeName;

    @Column(name = "trainer_name", length = 100)
    private String trainerName;

    @Column(name = "training_date", nullable = false)
    private LocalDate trainingDate;

    @Column(length = 20)
    private String mode = "ONLINE"; // ONLINE, OFFLINE

    private int seats = 30;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(length = 30, nullable = false)
    private String status = "ENROLLED"; // ENROLLED, ATTENDED, COMPLETED, ABSENT

    @Column(name = "certificate_code", length = 100)
    private String certificateCode;

    @Column(name = "feedback_score")
    private Integer feedbackScore;

    public TrainingRecord() {}

    public TrainingRecord(String programmeName, String trainerName, LocalDate trainingDate, String mode, Employee employee) {
        this.programmeName = programmeName;
        this.trainerName = trainerName;
        this.trainingDate = trainingDate;
        this.mode = mode;
        this.employee = employee;
        this.status = "ENROLLED";
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getProgrammeName() { return programmeName; }
    public void setProgrammeName(String programmeName) { this.programmeName = programmeName; }

    public String getTrainerName() { return trainerName; }
    public void setTrainerName(String trainerName) { this.trainerName = trainerName; }

    public LocalDate getTrainingDate() { return trainingDate; }
    public void setTrainingDate(LocalDate trainingDate) { this.trainingDate = trainingDate; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public int getSeats() { return seats; }
    public void setSeats(int seats) { this.seats = seats; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCertificateCode() { return certificateCode; }
    public void setCertificateCode(String certificateCode) { this.certificateCode = certificateCode; }

    public Integer getFeedbackScore() { return feedbackScore; }
    public void setFeedbackScore(Integer feedbackScore) { this.feedbackScore = feedbackScore; }
}
