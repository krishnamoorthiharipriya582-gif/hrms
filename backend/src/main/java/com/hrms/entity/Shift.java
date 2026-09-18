package com.hrms.entity;

import jakarta.persistence.*;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "shifts")
public class Shift {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 50)
    private String name; // General, Morning, Evening, Night

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "late_threshold_minutes")
    private int lateThresholdMinutes = 15;

    public Shift() {}

    public Shift(String name, LocalTime startTime, LocalTime endTime, int lateThresholdMinutes) {
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.lateThresholdMinutes = lateThresholdMinutes;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public int getLateThresholdMinutes() { return lateThresholdMinutes; }
    public void setLateThresholdMinutes(int lateThresholdMinutes) { this.lateThresholdMinutes = lateThresholdMinutes; }
}
