package com.hrms.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "attendance_records", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"employee_id", "work_date"})
})
public class AttendanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "work_date", nullable = false)
    private LocalDate workDate;

    @Column(name = "in_punch")
    private LocalTime inPunch;

    @Column(name = "out_punch")
    private LocalTime outPunch;

    @Column(length = 30)
    private String source = "BIOMETRIC"; // BIOMETRIC, MOBILE, REGULARISED

    @Column(length = 30, nullable = false)
    private String status = "PRESENT"; // PRESENT, ABSENT, HALF_DAY, HOLIDAY, LEAVE, LOP

    private Double latitude;
    private Double longitude;

    @Column(length = 255)
    private String remarks;

    @Column(name = "regularisation_reason", length = 255)
    private String regularisationReason;

    @Column(name = "regularisation_status", length = 30)
    private String regularisationStatus = "NONE"; // NONE, PENDING, APPROVED, REJECTED

    public AttendanceRecord() {}

    public AttendanceRecord(Employee employee, LocalDate workDate, LocalTime inPunch, LocalTime outPunch, String source, String status) {
        this.employee = employee;
        this.workDate = workDate;
        this.inPunch = inPunch;
        this.outPunch = outPunch;
        this.source = source;
        this.status = status;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public LocalDate getWorkDate() { return workDate; }
    public void setWorkDate(LocalDate workDate) { this.workDate = workDate; }

    public LocalTime getInPunch() { return inPunch; }
    public void setInPunch(LocalTime inPunch) { this.inPunch = inPunch; }

    public LocalTime getOutPunch() { return outPunch; }
    public void setOutPunch(LocalTime outPunch) { this.outPunch = outPunch; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getRegularisationReason() { return regularisationReason; }
    public void setRegularisationReason(String regularisationReason) { this.regularisationReason = regularisationReason; }

    public String getRegularisationStatus() { return regularisationStatus; }
    public void setRegularisationStatus(String regularisationStatus) { this.regularisationStatus = regularisationStatus; }
}
